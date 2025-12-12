import React from 'react'
import { termsConditionsData } from './content'

const TermsConditions = () => {
    return (
        <div className='w-auto px-50 bg-base-200'>
            <h1 className="text-2xl font-bold text-center pt-5">Terms & Conditons — DevTinder</h1>
            {termsConditionsData?.length > 0 ? (
                termsConditionsData.map(({ heading, content }, ind) => (
                    <div key={ind} className='w-full h-auto p-2 mb-2'>
                        <h3 className='text-xl font-bold underline'>{heading}</h3>
                        <p className="py-6 text-lg font-sans align-justify">
                            {content}
                        </p>
                    </div>
                ))
            ) : ''}
        </div>
    )
}

export default TermsConditions