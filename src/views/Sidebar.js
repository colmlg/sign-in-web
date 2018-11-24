import React, { Component } from 'react';
import {
    AppSidebar,
    AppSidebarFooter,
    AppSidebarForm,
    AppSidebarHeader,
    AppSidebarMinimizer,
    AppSidebarNav
} from "@coreui/react";

import moduleService from '../services/moduleService';


let navigation = { items: [
    {
        name: 'Dashboard',
        url: '/dashboard',
        icon: 'icon-speedometer',
        // badge: {
        //   variant: 'info',
        //   text: 'NEW',
        // },
    },
    {
        title: true,
        name: 'Modules',
        wrapper: {            // optional wrapper object
            element: '',        // required valid HTML5 element tag
            attributes: {}        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
        },
        class: ''             // optional class names space delimited list for title item ex: "text-center"
    }
]};

class Sidebar extends Component {
    constructor() {
        super();
        this.state = {
            navigation: navigation
        };
    }

    componentDidMount() {
        moduleService.getModules().then(modules => {
            modules.forEach(module => {
                navigation.items.push({
                    name: module.id.toUpperCase(),
                    url: '/module/' + module.id,
                    icon: 'icon-book-open',
                });
            });

            navigation.items.push({
                name: 'Add a module',
                url: '/module/new/',
                icon: 'icon-plus',
            });

            this.setState({ navigation: navigation });
        });
    }

    render() {
        return(
            <AppSidebar fixed display="lg">
                <AppSidebarHeader />
                <AppSidebarForm />
                <AppSidebarNav navConfig={navigation} />
                <AppSidebarFooter />
                <AppSidebarMinimizer />
            </AppSidebar>
        )
    }
}

export default Sidebar;

