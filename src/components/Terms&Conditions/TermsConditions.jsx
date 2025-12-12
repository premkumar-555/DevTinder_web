import React from 'react'
import { termsConditionsData } from './termsConditions'
import Template from './template'

const TermsConditions = () => {
    return (
        <Template page='Terms & Conditions' data={termsConditionsData} />
    )
}

export default TermsConditions