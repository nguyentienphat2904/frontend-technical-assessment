"use client"

import { UserOperation } from '@/app/api/user';
import { User, UserAlbums } from '@/types/user';
import { url } from 'inspector';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { BreadCrumb } from 'primereact/breadcrumb';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Divider } from 'primereact/divider';
import { Skeleton } from 'primereact/skeleton';
import { Toast } from 'primereact/toast';
import React, { useEffect, useRef, useState } from 'react'

export default function DetailUser() {

    const router = useRouter();

    const toast = useRef<Toast>(null)

    const [user, setUser] = useState<User | null>(null);
    const [userAlbums, setUserAlbums] = useState<UserAlbums[]>([]);
    const itemsAlbums = Array.from({ length: 5 }, (v, i) => ({
        id: '',
        title: '',
    }));

    const { id } = useParams();

    const items = [
        { label: 'Show' },
    ];
    const home = {
        icon: 'pi pi-id-card', label: 'Users', url: '/users'
    };

    useEffect(() => {
        async function getUserAndUserAlbum(id: string) {
            const userOp = new UserOperation();
            try {
                const resUser = await userOp.getUserByID(id)
                setUser(resUser.data || null)
                const resAlbums = await userOp.getUserAlbums(id)
                setUserAlbums(resAlbums.data || [])
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

        getUserAndUserAlbum(id)
    }, []);

    const renderAction = (rowData: User) => {
        return (
            <Button label="Show" icon="pi pi-eye" size="small" severity="secondary" outlined
                onClick={() => router.push(`/albums/${rowData.id}`)} />
        )
    }

    const goBack = () => {
        router.back()
    }

    return (
        <div>
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
                    Show Users
                </div>
            </div>
            <div className='card'>
                <div className='card'>
                    {user ? (
                        <div className="flex items-start gap-4">
                            <img
                                src={`https://ui-avatars.com/api/?name=${user?.name}&background=random&rounded=true`}
                                alt={user?.name}
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div className="text-base font-semibold text-gray-800">{user?.name}</div>
                                <a
                                    href={`mailto:${user?.email}`}
                                    className="text-blue-600 block"
                                >
                                    {user?.email}
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

                    <div className='text-2xl font-bold my-4'>
                        Albums
                    </div>
                    {userAlbums.length > 0 ? (
                        <DataTable value={userAlbums} removableSort selectionMode={"single"} tableStyle={{ minWidth: '50rem' }} className='text-sm'>
                            <Column sortable field="id" header="ID"></Column>
                            <Column sortable field="title" header="Title"></Column>
                            <Column body={renderAction} header="Actions" style={{ minWidth: '8rem' }}></Column>
                        </DataTable>
                    ) : (
                        <DataTable value={itemsAlbums} removableSort selectionMode={"single"} tableStyle={{ minWidth: '50rem' }} className='text-sm'>
                            <Column sortable field="id" header="ID" body={<Skeleton />}></Column>
                            <Column sortable field="title" header="Title" body={<Skeleton />}></Column>
                            <Column header="Actions" style={{ minWidth: '8rem' }} body={<Skeleton />}></Column>
                        </DataTable>
                    )}

                </div>
            </div>
        </div>


    )
}
