import { useRouter } from 'next/router';
import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import SWR from 'swr';
import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';
import { getFilteredEvents } from '../../helpers/api-util';


function FilteredEventsPage(props) {
  const [loadedEvents, setLoadedEvents] = useState();
  const router = useRouter();
  const filterData = router.query.slug;
  const { data, error } = SWR(`https://nextjs-event-project-84dac-default-rtdb.firebaseio.com/events.json`, (url) => fetch(url).then(res => res.json()))

  console.log("SWR data --->", data)
  useEffect(() => {
    if (data) {
      const events = []
      for (const key in data) {
        events.push({
          id: key,
          ...data[key]
        })
      }
      setLoadedEvents(events)
    }
  }, [data])

  let pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta name='description' content={`A list of filtered events.`} />
    </Head>
  );

  if (!loadedEvents) {
    return <p className='center'>Loading...</p>
  }
  let filteredYear = filterData[0];
  let filteredMonth = filterData[1];

  const numYear = +filteredYear;
  const numMonth = +filteredMonth;

  pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name='description'
        content={`All events for ${numMonth}/${numYear}.`}
      />
    </Head>
  );
  if (isNaN(numYear) || isNaN(numMonth) || numYear > 2030 || numYear < 2021 || numMonth < 1 || numMonth > 12 || error) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid Filter Please adjust your values !!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events/'>Show All Events</Button>
        </div>
      </Fragment>
    )
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    // console.log("--->", eventDate.getFullYear(), eventDate.getMonth())
    return eventDate.getFullYear() === numYear && eventDate.getMonth() === numMonth - 1;
  });

  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <Fragment>
        {pageHeadData}
        <ErrorAlert>
          <p>No events Found for the Chosen filter !!</p>
        </ErrorAlert>
        <div className='center'>
          <Button link='/events/'>Show All Events</Button>
        </div>
      </Fragment>
    )
  }
  const date = new Date(numYear, numMonth - 1)
  return (
    <Fragment>
      {pageHeadData}
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </Fragment>
  )
}

// export async function getServerSideProps(context) {
//   const { params } = context;
//   const filterData = params.slug;

//   let filteredYear = filterData[0];
//   let filteredMonth = filterData[1];

//   const numYear = +filteredYear;
//   const numMonth = +filteredMonth;

//   if (isNaN(numYear) || isNaN(numMonth) || numYear > 2030 || numYear < 2021 || numMonth < 1 || numMonth > 12) {
//     return {
//       props: { hasError: true },
//       // notFound: true,
//       // redirect: {
//       //   destination: '/error'
//       // }
//     }
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: numYear,
//     month: numMonth
//   });

//   return {
//     props: {
//       events: filteredEvents,
//       date: {
//         year: numYear,
//         month: numMonth
//       }
//     }
//   }
// }

export default FilteredEventsPage