import { Router } from 'express';
import productsRoutes from './products.routes.js';
import ordersRoutes from './orders.routes.js';
import codRoutes from './cod.routes.js';
import materialsRoutes from './materials.routes.js';
import adminRoutes from './admin.routes.js';
import couponsRoutes from './coupons.routes.js';
import chatRoutes from './chat.routes.js';
import warrantyRoutes from './warranty.routes.js';
import authRoutes from './auth.routes.js';
import customStudioRoutes from './custom-studio.routes.js';
import procurementRoutes from './procurement.routes.js';
import paymentRoutes from './payment.routes.js';
import otpRoutes from './otp.routes.js';
import logisticsRoutes from './logistics.routes.js';

const apiV1Router = Router();

apiV1Router.use('/products', productsRoutes);
apiV1Router.use('/orders', ordersRoutes);
apiV1Router.use('/payment', paymentRoutes);
apiV1Router.use('/otp', otpRoutes);
apiV1Router.use('/logistics', logisticsRoutes);
apiV1Router.use('/cod-points', codRoutes);
apiV1Router.use('/raw-materials', materialsRoutes);
apiV1Router.use('/admin', adminRoutes);
apiV1Router.use('/coupons', couponsRoutes);
apiV1Router.use('/chat', chatRoutes);
apiV1Router.use('/warranty', warrantyRoutes);
apiV1Router.use('/auth', authRoutes);
apiV1Router.use('/custom-studio', customStudioRoutes);
apiV1Router.use('/procurement', procurementRoutes);

export default apiV1Router;
