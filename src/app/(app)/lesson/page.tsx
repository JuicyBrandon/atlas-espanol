import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import LessonPlayer from '@/components/lesson/LessonPlayer'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Link from 'next/link'
import AllLessonsDone from '@/components/lesson/AllLessonsDone'
import { BookOpen } from 'lucide-react'
import type { Lesson } from '@/types'

async function getNextLesson(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userId: string,
  userLevel: number,
  specificId?: string
): Promise<{ lesson: Lesson | null; allDone: boolean }> {
  // Load a specific lesson if requested (including AI-generated ones)
  if (specificId) {
    const { data } = await supabase
      .from('lessons')
      .select('*')
      .eq('id', specificId)
      .single()
    return { lesson: data, allDone: false }
  }

  // Get seeded (non-generated) lessons at user's level
  const { data: lessons } = await supabase
    .from('lessons')
    .select('*')
    .eq('level', userLevel)
    .eq('is_generated', false)
    .order('sort_order')

  if (!lessons?.length) {
    const { data: fallback } = await supabase
      .from('lessons')
      .select('*')
      .eq('level', 1)
      .eq('is_generated', false)
      .order('sort_order')
      .limit(1)
    return { lesson: fallback?.[0] ?? null, allDone: false }
  }

  const lessonIds = lessons.map(l => l.id)
  const { data: completed } = await supabase
    .from('user_lessons')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('status', 'completed')
    .in('lesson_id', lessonIds)

  const completedIds = new Set(completed?.map(ul => ul.lesson_id) ?? [])
  const next = lessons.find(l => !completedIds.has(l.id))

  if (!next) {
    // All seeded lessons done — signal the "all done" state
    return { lesson: null, allDone: true }
  }

  return { lesson: next, allDone: false }
}

export default async function LessonPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { id: specificId } = await searchParams

  const { data: userData } = await supabase
    .from('users')
    .select('current_level')
    .eq('id', user.id)
    .single()

  const userLevel = userData?.current_level ?? 1

  const { lesson, allDone } = await getNextLesson(supabase, user.id, userLevel, specificId)

  if (allDone) {
    return <AllLessonsDone userLevel={userLevel} />
  }

  if (!lesson) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center py-16">
          <BookOpen className="w-8 h-8 text-[#F2C94C] mx-auto mb-4" />
          <h2 className="font-bold text-[#1E2A3A] mb-2">No lessons available yet</h2>
          <p className="text-sm text-[#6F4E37]/70 mb-6">
            Curriculum content is being added. Check back soon!
          </p>
          <Link href="/dashboard">
            <Button>Back to dashboard</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return <LessonPlayer lesson={lesson} />
}
