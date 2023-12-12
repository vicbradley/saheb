import Countdown from 'react-countdown';

const CountdownTimer = (props) => {

  const renderer = ({ hours, minutes, seconds, completed }) => {
    if (completed) {
      // Render a completed state
      return <p className='text-xs lg:text-sm'>Sesi konsultasi selesai...</p>;
    } else {
      // Render a countdown
      return <span>{hours}:{minutes}:{seconds}</span>;
    }
  };

  return (
    <Countdown date={props.chatExpired} renderer={renderer} onComplete={props.changeChatExpiredState}/>
  )
}

export default CountdownTimer