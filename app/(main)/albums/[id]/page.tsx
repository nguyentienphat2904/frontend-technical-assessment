"use client"

import { AlbumOperation } from '@/app/api/album';
import { Album, AlbumPhoto } from '@/types/album';
import { useParams, useRouter } from 'next/navigation'
import { BreadCrumb } from 'primereact/breadcrumb';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import { Image } from 'primereact/image';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from 'primereact/button';
import Head from 'next/head';

export default function DetailAlbum() {

    const router = useRouter();

    const toast = useRef<Toast>(null)

    const [album, setAlbum] = useState<Album | null>(null);
    const [photos, setPhotos] = useState<AlbumPhoto[]>([]);

    const { id } = useParams();

    const items = [
        { label: 'Show' },
    ];
    const home = {
        icon: 'pi pi-list', label: 'Albums', url: '/albums?pageSize=20&current=1'
    };

    useEffect(() => {
        async function getAlbumAndPhotos(id: string) {
            try {
                const albumOp = new AlbumOperation()
                const resAlbum = await albumOp.getAlbumById(id)
                const resPhotos = await albumOp.getAlbumPhotos(id)
                setAlbum(resAlbum.data || null);
                setPhotos(resPhotos.data || [])
            } catch (error: any) {
                const mes = error.message;
                toast.current?.show({
                    severity: "error",
                    summary: "Error",
                    detail: mes,
                    life: 3000,
                });
            }
        }

        getAlbumAndPhotos(id)
    }, []);

    const goBack = () => {
        router.back()
    }

    return (
        <div>
            <Head>
                <title>#{id} Album Show | Refine</title>
                <meta name="description" content="This is the albums page of Refine." />
            </Head>
            <div>
                <BreadCrumb model={items} home={home} className='border-none text-lg' style={{ backgroundColor: 'var(--surface-ground)' }} />
            </div>
            <div className='flex flex-row gap-2 mb-2'>
                <Button icon='pi pi-arrow-left' severity='secondary' outlined className='border-none'
                    onClick={goBack}></Button>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }} className='text-xl font-semibold'>
                    Show Album
                </div>
            </div>
            <div className='card'>
                <div className='card'>
                    {album ? (
                        <div className="flex items-start gap-4">
                            <img
                                src={`https://ui-avatars.com/api/?name=${album?.username}&background=random&rounded=true`}
                                alt={album?.username}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="text-base font-semibold text-gray-800">
                                    <a href={`/users/${album.userId}`}
                                        className="text-blue-600 block">
                                        {album?.username}
                                    </a>
                                </div>
                                <a
                                    href={`mailto:${album?.email}`}
                                    className="text-blue-600 block"
                                >
                                    {album?.email}
                                </a>
                            </div>
                        </div>
                    ) : (
                        <div className="border-round border-1 surface-border p-4">
                            <ul className="m-0 p-0 list-none">
                                <li>
                                    <div className="flex">
                                        <Skeleton shape="circle" size="4rem" className="mr-2"></Skeleton>
                                        <div style={{ flex: '1' }}>
                                            <Skeleton width="100%" className="mb-2"></Skeleton>
                                            <Skeleton width="75%"></Skeleton>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    )}

                    <Divider />

                    <div
                        style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                            gap: '16px',
                        }}
                    >
                        {photos.length > 0 ? (
                            photos.slice(0, 10).map((photo) => (
                                <Image
                                    key={photo.id}
                                    src={photo.thumbnailUrl}
                                    alt={photo.title}
                                    preview
                                />
                            ))
                        ) : (
                            Array(6)
                                .fill(null)
                                .map((_, index) => (
                                    <Skeleton key={index} width="100%" height="150px" />
                                ))
                        )}
                    </div>


                </div>
            </div>
        </div >
    )
}
