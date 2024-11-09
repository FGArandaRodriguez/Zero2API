import { NextRequest, NextResponse } from 'next/server';
import { checkPermission } from './pages/middleware/checkPermissions';
import { NextApiRequest, NextApiResponse } from 'next';

const tablePermissions: { [key: string]: { [method: string]: string } } = {
    '/api/categoria': {
        GET: 'ver_categorias',
        POST: 'crear_categorias',
        PUT: 'editar_categoria',
        DELETE: 'eliminar_categoria',
    },
    '/api/product': {
        GET: 'ver_productos',
        POST: 'crear_productos',
        PUT: 'editar_producto',
        DELETE: 'eliminar_producto',
    },
    '/api/clientes': {
        GET: 'ver_clientes',
        POST: 'crear_clientes',
        PUT: 'editar_clientes',
        DELETE: 'eliminar_clientes',
    },
    '/api/reservas': {
        GET: 'ver_reservas',
        POST: 'crear_reservas',
        PUT: 'editar_reservas',
        DELETE: 'eliminar_reservas',
    },
    '/api/pedidos': {
        GET: 'ver_pedidos',
        POST: 'crear_pedidos',
        PUT: 'editar_pedidos',
        DELETE: 'eliminar_pedidos',
    },
    '/api/detallepedidos': {
        GET: 'ver_detallepedidos',
        POST: 'crear_detallepedidos',
        PUT: 'editar_detallepedidos',
        DELETE: 'eliminar_detallepedidos',
    },
    '/api/mesas': {
        GET: 'ver_mesas',
        POST: 'crear_mesas',
        PUT: 'editar_mesas',
        DELETE: 'eliminar_mesas',
    },
    '/api/empleados': {
        GET: 'ver_empleados',
        POST: 'crear_empleados',
        PUT: 'editar_empleados',
        DELETE: 'eliminar_empleados',
    },
    '/api/permisos': {
        GET: 'ver_permisos',
        POST: 'crear_permisos',
        PUT: 'editar_permisos',
        DELETE: 'eliminar_permisos',
    },
    '/api/permisosempleados': {
        GET: 'ver_permisosempleados',
        POST: 'crear_permisosempleados',
        PUT: 'editar_permisosempleados',
        DELETE: 'eliminar_permisosempleados',
    },
    '/api/user': {
        GET: 'ver_usuarios',
        POST: 'crear_usuarios',
        PUT: 'editar_usuarios',
        DELETE: 'eliminar_usuarios',
    },
    '/api/menu': {
        GET: 'ver_menu',
        POST: 'crear_menu',
        PUT: 'editar_menu',
        DELETE: 'eliminar_menu',
    },
    '/api/ticket': {
        GET: 'ver_tickets',
        POST: 'crear_tickets',
        PUT: 'editar_tickets',
        DELETE: 'eliminar_tickets',
    },
    '/api/pago': {
        GET: 'ver_pagos',
        POST: 'crear_pagos',
        PUT: 'editar_pagos',
        DELETE: 'eliminar_pagos',
    },
    '/api/metodo_pago': {
        GET: 'ver_metodos_pago',
        POST: 'crear_metodo_pago',
        PUT: 'editar_metodo_pago',
        DELETE: 'eliminar_metodo_pago',
    },
    '/api/producto': {
        GET: 'ver_productos',
        POST: 'crear_productos',
        PUT: 'editar_producto',
        DELETE: 'eliminar_producto',
    },
    '/api/ordenes_cocina': {
        GET: 'ver_ordenes_cocina',
        POST: 'crear_ordenes_cocina',
        PUT: 'editar_ordenes_cocina',
        DELETE: 'eliminar_ordenes_cocina',
    },
};

export async function middleware(req: NextRequest) {
    const { method, nextUrl } = req;
    const pathname = nextUrl.pathname;

    const requiredPermission = tablePermissions[pathname]?.[method];

    if (requiredPermission) {
        const apiReq = req as unknown as NextApiRequest;
        const apiRes = NextResponse as unknown as NextApiResponse;

        try {
            await checkPermission(apiReq, apiRes, () => {}, requiredPermission);
        } catch (error) {
            return NextResponse.json({ error: 'No tienes permiso para realizar esta acción' }, { status: 403 });
        }
    }

    return NextResponse.next();}

export const config = {
    matcher: '/api/:path*', }
