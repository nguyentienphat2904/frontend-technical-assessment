import Link from 'next/link';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState } from 'react';
import { AppTopbarRef } from '@/types';
import { LayoutContext } from './context/layoutcontext';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { OverlayPanel } from 'primereact/overlaypanel';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current,
    }));

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <div className='flex align-items-center justify-content-center font-semibold gap-2'>
                    <img src={`https://geekup.vn/Icons/geekup-logo-general.svg`} alt="logo" className='hidden md:block' />
                </div>
            </Link>

            <button ref={menubuttonRef} type="button" className="p-link layout-menu-button layout-topbar-button" onClick={onMenuToggle}>
                <i className="pi pi-bars" />
            </button>

            <ConfirmDialog />
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;