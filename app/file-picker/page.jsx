'use client'
import React, { useEffect, useState } from 'react'
import FileInput from '@/app/file-picker/components/FileInput'
import Button from '@/app/file-picker/components/Button'
import { ArrowUpToLine, File, FileUp, X } from 'lucide-react'
import CompoundLayout from '@/app/components/CompoundLayout'
import { cn } from '@/utils/cn'
import axios from 'axios'

const getStatus = (status) => {
    const statuses = {
        queued: () => 'text-yellow-400',
        uploading: () => 'text-orange-400',
        success: () => 'text-green-400',
        failed: () => 'text-red-400',
    }
    return statuses?.[status]?.()
}
const formatFileSize = (size) => {
    if (!size) return '0 KB'
    const kb = size / 1024
    return kb < 1024 ? `${kb.toFixed(1)} KB` : `${(kb / 1024).toFixed(1)} MB`
}

const FileUpload = () => {
    return (
        <div className="h-full w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-white to-amber-50 font-sans">
            <FileMenu />
        </div>
    )
}
export default FileUpload

const FileMenu = ({ title = 'File Upload' }) => {
    const [files, setFiles] = useState([])
    const [uploading, setUploading] = useState(false)

    async function handleUpload() {
        if (files.length === 0 || uploading) return

        setUploading(true)

        const updateFile = (id, updates) => {
            setFiles((prev) =>
                prev.map((file) =>
                    file.id === id ? { ...file, ...updates } : file
                )
            )
        }

        const uploadFile = async (file) => {
            const formData = new FormData()
            formData.append('file', file.file)

            try {
                await axios.post('https://httpbin.org/post', formData, {
                    onUploadProgress: ({ loaded, total }) => {
                        const progress = Math.round(
                            (loaded * 100) / (total || 1)
                        )
                        updateFile(file.id, {
                            progress,
                            uploaded: loaded,
                            total,
                            status: 'uploading',
                        })
                    },
                })

                updateFile(file.id, { progress: 100, status: 'success' })
            } catch (err) {
                console.error(err)
                updateFile(file.id, { status: 'failed' })
            }
        }

        await Promise.all(files.map(uploadFile))

        setUploading(false)
    }

    return (
        <div className="max-w-lg w-full min-h-80 rounded-lg p-2 bg-[#1A1A1B]/90 backdrop-blur-lg border border-white/20 flex flex-col gap-2 ">
            <h2 className="text-white text-xl my-1">{title}</h2>
            <div className="flex gap-2 bg-stone-700/50 p-1 rounded-md backdrop-blur-lg">
                <FileInput
                    onChange={setFiles}
                    label="Select File"
                    accept=".png,.jpg,.pdf"
                />

                <Button
                    disabled={!files?.length}
                    onClick={handleUpload}
                    className=" bg-green-600 hover:bg-green-500 text-white rounded-md border border-white/20 text-sm"
                >
                    Upload
                    <ArrowUpToLine className={'size-4'} />
                </Button>

                <Button
                    disabled={!files?.length}
                    onClick={() => setFiles([])}
                    className="bg-red-700 hover:bg-red-600 text-white rounded-md text-sm"
                >
                    Clear
                    <X className={'size-4'} />
                </Button>
            </div>
            <FileList files={files} setFiles={setFiles} />
        </div>
    )
}

const FileList = ({ files, setFiles }) => {
    const onRemove = (index) => {
        setFiles((prev) => prev.filter((_, i) => i !== index))
    }

    return (
        <div className="scrollbar-thin scrollbar-thumb-stone-700 scrollbar-track-[#1A1A1B]/90 max-w-lg w-full h-80 rounded-lg p-2 bg-[#1A1A1B]/90 backdrop-blur-lg border border-white/20 flex flex-col gap-2 overflow-auto text-white">
            {files?.length ? (
                files?.map((file, index) => (
                    <FileTile
                        key={file?.file?.name}
                        data={file}
                        index={index}
                        onRemove={onRemove}
                    />
                ))
            ) : (
                <CompoundLayout
                    className={'w-full h-full flex items-center justify-center'}
                >
                    <FileUp className={'size-16 text-stone-700'} />
                </CompoundLayout>
            )}
        </div>
    )
}

const FileTile = ({ data = {}, index, onRemove }) => {
    const [previewURL, setPreviewURL] = useState(null)
    const isImage = (type) => type?.startsWith('image/')
    const { file, status, progress } = data || {}

    useEffect(() => {
        if (file && isImage(file.type)) {
            const url = URL.createObjectURL(file)
            setPreviewURL(url)
            return () => URL.revokeObjectURL(url)
        } else {
            setPreviewURL(null)
        }
    }, [file])

    return (
        <CompoundLayout className="text-white text-xs flex flex-col gap-2 bg-stone-700/30 backdrop-blur-lg p-2 rounded-md border border-white/10">
            <CompoundLayout.Row className="gap-3 items-start">
                {/* Image or Icon */}
                <CompoundLayout.Row>
                    <div className="w-10 h-10 bg-stone-800/30 rounded-md flex items-center justify-center overflow-hidden">
                        {previewURL ? (
                            <img
                                src={previewURL}
                                alt="preview"
                                className="object-cover w-full h-full"
                            />
                        ) : (
                            <File className="w-5 h-5 text-white/70" />
                        )}
                    </div>
                </CompoundLayout.Row>

                {/* File Details */}
                <CompoundLayout.Row className="flex-1">
                    <CompoundLayout.Column className="gap-1 w-full">
                        <span className="font-semibold line-clamp-1">
                            {file.name || 'Untitled File'}
                        </span>
                        <CompoundLayout.Row className="gap-2 text-stone-300 justify-between">
                            <div>
                                <span>
                                    {formatFileSize(data.uploaded || 0)} /{' '}
                                    {formatFileSize(data.total || file.size)}
                                </span>
                                <span>•</span>
                                <span>{file.type || 'Unknown Type'}</span>
                            </div>
                            <span
                                className={cn('uppercase', getStatus(status))}
                            >
                                {status || 'N/A'}
                            </span>
                        </CompoundLayout.Row>
                    </CompoundLayout.Column>
                </CompoundLayout.Row>

                {/* Remove Button */}
                <CompoundLayout.Row>
                    <button
                        onClick={() => onRemove(index)}
                        className="p-1 hover:bg-white/10 rounded transition"
                    >
                        <X className="size-4" />
                    </button>
                </CompoundLayout.Row>
            </CompoundLayout.Row>

            {/* Progress Bar */}
            <CompoundLayout.Column className="w-full h-1 bg-white/10 rounded-sm overflow-hidden">
                <div
                    className="bg-emerald-400 h-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                />
            </CompoundLayout.Column>
        </CompoundLayout>
    )
}
