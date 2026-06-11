import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { advanceVocabStatus, nextReviewDate } from '@/lib/utils'

export async function POST(req: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { itemId, correct } = await req.json()

  if (!itemId) return NextResponse.json({ error: 'itemId required' }, { status: 400 })

  // Get current item
  const { data: item, error: fetchError } = await supabase
    .from('vocabulary_items')
    .select('status, times_seen, times_correct, times_incorrect')
    .eq('id', itemId)
    .eq('user_id', user.id)
    .single()

  if (fetchError || !item) return NextResponse.json({ error: 'Item not found' }, { status: 404 })

  const newStatus = advanceVocabStatus(item.status, correct)
  const reviewDue = nextReviewDate(newStatus)

  const { error: updateError } = await supabase
    .from('vocabulary_items')
    .update({
      status: newStatus,
      review_due_at: reviewDue.toISOString(),
      times_seen: item.times_seen + 1,
      times_correct: correct ? item.times_correct + 1 : item.times_correct,
      times_incorrect: correct ? item.times_incorrect : item.times_incorrect + 1,
      updated_at: new Date().toISOString(),
    })
    .eq('id', itemId)
    .eq('user_id', user.id)

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  return NextResponse.json({ success: true, newStatus })
}
