import Vue from 'vue'
import VueRouter from 'vue-router';
import Home from "../pages/Home";
import NewPurchase from "../pages/NewPurchase";

Vue.use(VueRouter);

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
        path: '/new-purchase',
        name: 'newRequisition',
        component: NewPurchase
    }
];
const router = new VueRouter({
    routes
});

export default router;
