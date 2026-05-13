import React from 'react'
import FeedbackCard from '../FeedbackCard'

const FeedbackSection = () => {
  return (
    <div>
      <div className="flex flex-col md:m-28 gap-16 mb-24">
        <h2 className="text-center font-semibold text-5xl ">آراء عملاء <span className='text-accent'>تبارك</span></h2>
        <div className="flex gap-13.75 justify-center">
          <FeedbackCard avatar='' name='' desc='' content=''/>
        </div>
      </div>
    </div>
  )
}

export default FeedbackSection