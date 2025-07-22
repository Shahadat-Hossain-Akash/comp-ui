import React from 'react'
import { cn } from '@/utils/cn'

const CompoundLayout = ({ children, className }) => {
    return <div className={cn(className)}>{children}</div>
}

const Row = ({ children, className }) => {
    return <div className={cn('flex flex-row', className)}>{children}</div>
}

const Column = ({ children, className }) => {
    return <div className={cn('flex flex-col', className)}>{children}</div>
}

export default CompoundLayout

CompoundLayout.Row = Row
CompoundLayout.Column = Column
