import Countdown from 'react-countdown';

const CountdownTimer = ({chatExpired, formik}) => {

  const changeChangeExpiry = () => {
    formik.setFieldValue("isChatExpired", true)
  }

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
    <Countdown date={chatExpired} renderer={renderer} onComplete={changeChangeExpiry}/>
  )
}

export default CountdownTimer