"use client"

import { AlbumOperation } from '@/app/api/album';
import { Album } from '@/types/album';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable, DataTablePageEvent } from 'primereact/datatable';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'

export default function AlbumsPage() {

    const toast = useRef<Toast>(null);
    const router = useRouter();

    const searchParams = useSearchParams();

    const [basicRowsPerPageOptions, setBasicRowsPerPageOptions] = useState([10, 20, 50, 100]);
    const [pageSize, setPageSize] = useState<number>(Number(searchParams.get('pageSize')) || 20);
    const [current, setCurrent] = useState<number>(Number(searchParams.get('current')) || 1);
    const first = (current - 1) * pageSize;

    const [albums, setAlbums] = useState<Album[]>([]);
    const items = Array.from({ length: 5 }, (v, i) => ({
        id: '',
        title: '',
        username: '',
        userId: ''
    }));

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set('pageSize', String(pageSize));
        params.set('current', String(current));
        window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }, [pageSize, current]);

    useEffect(() => {
        if (!basicRowsPerPageOptions.includes(Number(searchParams.get('pageSize')))) {
            setBasicRowsPerPageOptions(prev => [Number(searchParams.get('pageSize')), ...prev])
        }
        setPageSize(Number(searchParams.get('pageSize')) || 20);
        setCurrent(Number(searchParams.get('current')) || 1);
    }, [searchParams]);

    useEffect(() => {
        async function getAlbumsList() {
            const albumOp = new AlbumOperation()
            try {
                const response = await albumOp.getAllAlbums()
                setAlbums(response.data || [])
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
        getAlbumsList()
    }, []);

    const renderAction = (rowData: Album) => {
        return (
            <Button label="Show" icon="pi pi-eye" size="small" severity="secondary" outlined
                onClick={() => router.push(`/albums/${rowData.id}`)} />
        )
    }

    return (
        <div className='card'>
            <Toast ref={toast}></Toast>
            <div className='text-4xl font-bold mb-4'>
                Albums
            </div>
            {albums.length > 0 ? (
                <DataTable value={albums} removableSort selectionMode={"single"}
                    paginator rows={pageSize} first={first} rowsPerPageOptions={basicRowsPerPageOptions}
                    onPage={(e: DataTablePageEvent) => {
                        setCurrent((e.page ?? 0) + 1);
                        setPageSize((e.rows ?? 20))
                    }}
                    tableStyle={{ minWidth: '50rem' }} className='text-sm'>
                    <Column sortable field="id" header="ID"></Column>
                    <Column sortable field="title" header="Title"></Column>
                    <Column sortable header="User" body={(rowData) => (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div>
                                <img
                                    src={`https://ui-avatars.com/api/?name=${rowData.username}&background=random&rounded=true`}
                                    alt={rowData.username}
                                    style={{ width: '2em', height: '2em' }}
                                />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <a
                                    href={`/users/${rowData.userId}`}
                                    style={{ color: '#007bff', height: 'fit-content' }}
                                >
                                    {rowData.username}
                                </a>
                            </div>
                        </div>
                    )}></Column>
                    <Column body={renderAction} header="Actions" style={{ minWidth: '8rem' }}></Column>
                </DataTable>
            ) : (
                <DataTable value={items} className="p-datatable-striped">
                    <Column field="id" header="Id" style={{ width: '25%' }} body={<Skeleton />}></Column>
                    <Column field="title" header="Title" style={{ width: '25%' }} body={<Skeleton />}></Column>
                    <Column header="User" style={{ width: '25%' }} body={<Skeleton />}></Column>
                    <Column header="Actions" style={{ width: '25%' }} body={<Skeleton />}></Column>
                </DataTable>
            )}

        </div>
    )
}
