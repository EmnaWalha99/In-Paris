import { useMemo, useState } from 'react'
import type { CategoryKey } from './types'
import { CATEGORIES } from './categories'
import { ArrondissementFilter } from './components/events/ArrondissementFilter'
import { CategoryBar } from './components/events/CategoryBar'
import { DayPicker } from './components/events/DayPicker'
import { EventList } from './components/events/EventList'
import { Footer } from './components/layout/Footer'
import { Header } from './components/layout/Header'
import { MobileViewToggle, type MobileView } from './components/layout/MobileViewToggle'
import { ArrondissementLayer } from './components/map/ArrondissementLayer'
import { EventMap } from './components/map/EventMap'
import { DAYS_SHOWN } from './config'
import { useEvents } from './hooks/useEvents'
import { getUpcomingDays } from './utils/format'

function App() {
  const days = useMemo(() => getUpcomingDays(DAYS_SHOWN), [])
  const today = days[0].value
  const [date, setDate] = useState(today)
  const [category, setCategory] = useState<CategoryKey | null>(null)
  const [arrondissements, setArrondissements] = useState<number[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<MobileView>('list')
  const events = useEvents(date, category, arrondissements)

  // Kept sorted so [11, 5] and [5, 11] share the same cache entry.
  const toggleArrondissement = (value: number) =>
    setArrondissements((current) =>
      current.includes(value) ? current.filter((a) => a !== value) : [...current, value].sort((a, b) => a - b),
    )

  return (
    <div className="flex h-dvh w-full flex-col bg-surface font-sans text-on-surface">
      <Header>
        <DayPicker days={days} selected={date} onSelect={setDate} />
      </Header>
      <CategoryBar categories={CATEGORIES} selected={category} onSelect={setCategory} />

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
            onBackToToday={date !== today ? () => setDate(today) : undefined}
            filters={
              <ArrondissementFilter
                selected={arrondissements}
                onRemove={toggleArrondissement}
                onClear={() => setArrondissements([])}
              />
            }
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
          >
            <ArrondissementLayer selected={arrondissements} onToggle={toggleArrondissement} />
          </EventMap>
        </section>

        <MobileViewToggle view={mobileView} onChange={setMobileView} />
      </main>

      <Footer />
    </div>
  )
}

export default App
