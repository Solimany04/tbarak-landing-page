import Image from 'next/image'
import React from 'react'

type FeedbackCardProps = {
    avatar: string,
    name: string,
    desc: string,
    content: string
}

const FeedbackCard = ({ avatar, name, desc, content }: FeedbackCardProps) => {
  return (
    <div className='h-56.5 w-95 md:w-100 bg-white flex flex-col gap-5 px-8 py-11 rounded-3xl outline-1 outline-primary/8'>
      <div className="flex gap-6 items-center">
        <Image className='' width={70} height={70} src="/FeadbackAvatars/Ellipse.png" alt={`${name}'s Avatar`}/>
        <div className="flex flex-col">
            <h4 className=''>عبدالله عبدالخالق</h4>
            <p className="">ورشة تصميم مفروشات</p>
        </div>
      </div>
      <p className="">ثبات الألوان ممتاز، والقماش يتحمل الغسيل المستمر دون أي مشاكل.</p>
    </div>
  )
}

export default FeedbackCard
