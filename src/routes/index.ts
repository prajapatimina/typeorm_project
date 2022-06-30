import { Application } from "express";
import authRoutes from "./auth";
import permissionRoutes from "./permission";
import roleRoutes from "./role";
import rolePermissionRoutes from "./rolePermission";
import userRoutes from "./user";
import userRolesRoutes from "./userRoles";

function route(app:Application){


    app.use('/api/users', userRoutes);
    app.use('/api/auth', authRoutes);
    app.use('/api/roles', roleRoutes);
    app.use('/api/permission',permissionRoutes);
    app.use('/api/rolePermission',rolePermissionRoutes);
    app.use('/api/userRoles',userRolesRoutes);
    // app.use('/', (req, res) => {
    //     res.send('This is express');
    // });
}
export default route;