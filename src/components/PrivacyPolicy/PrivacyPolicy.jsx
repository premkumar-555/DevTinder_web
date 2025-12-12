import React from 'react'
import { data } from './privacyPolicies'
import Template from '../Terms&Conditions/template'
const PrivacyPolicy = () => {
    return (
        <Template page='Privacy Policies' data={data} />
    )
}

export default PrivacyPolicy