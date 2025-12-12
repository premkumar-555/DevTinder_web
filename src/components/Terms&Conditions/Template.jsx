import React from 'react'

const Template = ({ page, data }) => {
    return (
        <div className='w-auto px-50 bg-base-200'>
            {page && <h1 className="text-2xl font-bold text-center pt-5">{page + ' — DevTinder'} </h1>}
            {data?.length > 0 ? (
                data.map(({ heading, content }, ind) => (
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

export default Template