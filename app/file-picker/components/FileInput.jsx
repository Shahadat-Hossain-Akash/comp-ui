'use client'
import React, { useRef, useState } from 'react'
import { Plus } from 'lucide-react'

const FileInput = ({
    label = 'Select File',
    onChange = (file) => {},
    accept = '*',
    multiple = true,
    className,
}) => {
    const inputRef = useRef(null)

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return

        const enhancedFiles = files.map((file) => ({
            id: crypto.randomUUID(),
            file,
            progress: 0,
            uploaded: 0,
            total: file.size,
            status: 'queued',
        }))

        onChange((prev) => [...prev, ...enhancedFiles])
        e.target.value = ''
    }

    return (
        <div className="flex flex-col gap-2 w-full">
            <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                accept={accept}
                multiple={multiple}
                className="hidden"
            />
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className={
                    'cursor-pointer bg-orange-700 hover:bg-orange-600 text-white py-1 px-3 text-sm rounded-md border border-white/20 text-center transition duration-200 flex items-center justify-center gap-1'
                }
            >
                {label}
                <Plus className={'size-4'} />
            </button>
        </div>
    )
}

export default FileInput
