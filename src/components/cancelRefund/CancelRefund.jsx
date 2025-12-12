import React from 'react'
import { cancellationRefundPolicy } from './cancelRefundData'
import Template from '../Terms&Conditions/Template'
const CancelRefund = () => {
    return (
        <Template page="Cancel & Refund Policy" data={cancellationRefundPolicy} />
    )
}

export default CancelRefund