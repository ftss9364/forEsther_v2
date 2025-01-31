import UnitPrice from '../pages/unitprice/ListPage';
import Item from '../pages/item/ListPage';
import ItemRegister from '../pages/item/RegisterPage';
import Bom from '../pages/bom/ListPage';
import URegister from "../pages/unitprice/Register";
import BomRegister from "../pages/bom/RegisterPage"
import SignUp from '../pages/sign/SignUp';
import SignIn from '../pages/sign/SignIn';
import UserProfile from '../pages/sign/UserProfile';

const routes = [
    {
        path: '/unitprices',
        component: UnitPrice
    },
    {
        path : "/unitprices/register",
        component : URegister
    },
    {
        path: '/seriallots',
        component: UnitPrice
    },
    {
        path: '/items',
        component: Item,
    },
    {
        path: '/items/register',
        component: ItemRegister
    },
    {
        path: '/boms',
        component: Bom
    },    
    {
        path: '/boms/:bom_code',
        component: BomRegister
    },
    {
        path: '/signup',
        component: SignUp
    },
    {
        path: '/signin',
        component: SignIn
    },
    {
        path: '/userprofile',
        component: UserProfile
    }
];

export default routes;