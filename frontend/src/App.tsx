import { useMemo, useState } from 'react'
import type { CategoryKey } from './api'
import { CATEGORIES } from './categories'
import { CategoryBar } from './components/events/CategoryBar'
import { DayPicker } from './components/events/DayPicker'
import { EventList } from './components/events/EventList'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { EventMap } from './components/map/EventMap'
import { Icon } from './components/ui/Icon'
import { useEvents } from './hooks/useEvents'
import { getUpcomingDays } from './utils/format'

const DAYS_SHOWN = 7

type MobileView = 'list' | 'map'

function App() {
  const days = useMemo(() => getUpcomingDays(DAYS_SHOWN), [])
  const today = days[0].value
  const [date, setDate] = useState(today)
  const [category, setCategory] = useState<CategoryKey | null>(null)
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<MobileView>('list')
  const events = useEvents(date, category)

  const changeDate = (value: string) => {
    setDate(value)
    setActiveId(null)
  }

  const changeCategory = (value: CategoryKey | null) => {
    setCategory(value)
    setActiveId(null)
  }

  return (
    <div className="mx-auto flex h-dvh w-full max-w-[1440px] flex-col bg-surface font-sans text-on-surface">
      <Header>
        <DayPicker days={days} selected={date} onSelect={changeDate} />
      </Header>
      <CategoryBar categories={CATEGORIES} selected={category} onSelect={changeCategory} />

      <main className="relative flex min-h-0 flex-1">
        <section className={`${mobileView === 'list' ? 'flex' : 'hidden'} w-full flex-col lg:flex lg:w-[440px] lg:shrink-0 xl:w-[480px]`}>
          <EventList
            date={date}
            events={events.items}
            total={events.total}
            status={events.status}
            hasMore={events.hasMore}
            loadingMore={events.loadingMore}
            activeId={activeId}
            onActivate={setActiveId}
            onLoadMore={events.loadMore}
            onRetry={events.retry}
            onBackToToday={date !== today ? () => changeDate(today) : undefined}
          />
        </section>

        <section className={`${mobileView === 'map' ? 'flex' : 'hidden'} flex-1 bg-surface-container-low p-3 sm:p-4 lg:flex`}>
          <EventMap
            events={events.items}
            activeId={activeId}
            onActivate={setActiveId}
            onClose={() => setActiveId(null)}
            fitKey={events.loadedFor}
            visible={mobileView === 'map'}
          />
        </section>

        <button
          type="button"
          onClick={() => setMobileView(mobileView === 'list' ? 'map' : 'list')}
          className="absolute bottom-5 left-1/2 z-[1100] flex -translate-x-1/2 items-center gap-2 rounded-full bg-secondary px-5 py-2.5 text-label-md uppercase text-on-primary shadow-lg lg:hidden"
        >
          <Icon name={mobileView === 'list' ? 'map' : 'list'} className="text-[18px]" />
          {mobileView === 'list' ? 'Carte' : 'Liste'}
        </button>
      </main>

      <Footer />
    </div>
  )
}

export default App
