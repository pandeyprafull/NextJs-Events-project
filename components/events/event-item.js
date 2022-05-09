import Link from "next/link";
import classes from './event-item.module.css';

function EventItem(props) {
    const { title, image, date, location, id } = props;
    const humanReadableData = new Date(date).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
    const formattedLocation = location.replace(', ', '\n');
    const exploreLink = `/events/${id}`
    return (
        <li className={classes.item}>
            <img src={'/' + image} alt={title} />
            <div className={classes.content}>
                <div className={classes.summary}>
                    <h2>{title}</h2>
                    <div className={classes.date}>
                        <time>{humanReadableData}</time>
                    </div>
                    <div className={classes.address}>
                        <address>{formattedLocation}</address>
                    </div>
                </div>
                <div className={classes.actions}>
                    <Link href={exploreLink}>Explore Event</Link>
                </div>
            </div>

        </li>
    )

}

export default EventItem