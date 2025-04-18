<template>
    <div v-on:click="()=>alert('dddd')">
        <div class="navbar-header">
            <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#navbar-menu" v-on:click="expandCollapse()">
                <i class="fa fa-bars" v-on:click="expandCollapse()"></i>
            </button>
            <a class="navbar-brand" href="/"><span>Pay</span>nalton</a>

        </div>
        <div class="collapse navbar-collapse menu-ui-design" id="navbar-menu">
            <ul class="nav navbar-nav navbar-right" data-in="fadeInDown" data-out="fadeOutUp">
                <li :class="current=='home'?'scroll active':'scroll'"><a :href="`/${lang}`">{{ diccionario.home[lang] }}</a></li>
                <li :class="current=='about'?'scroll active':'scroll'"><a :href="`/${lang}/about`">{{ diccionario.about[lang] }}</a></li>
                <li :class="current=='jobs'?'scroll active':'scroll'"><a :href="`/${lang}/jobs`">{{ diccionario.jobs[lang] }}</a></li>
                <li :class="current=='projects'?'scroll active':'scroll'"><a :href="`/${lang}/projects`">{{ diccionario.projects[lang] }}</a></li>
                <li :class="current=='ideas'?'scroll active':'scroll'"><a :href="`/${lang}/ideas`">{{ diccionario.ideas[lang] }}</a></li>
                <li :class="current=='contact'?'scroll active':'scroll'"><a :href="`/${lang}/contact`">{{ diccionario.contact[lang] }}</a></li>
            </ul>
        </div>
    </div>
</template>
<script>

const diccionario = {
    home: {
        es: 'Inicio',
        en: 'Home'
    },
    about: {
        es: 'Mi vida',
        en: 'My Life'
    },
    jobs: {
        es: 'Mi trabajo',
        en: 'My Employers'
    },
    projects: {
        es: 'Mis proyectos',
        en: 'My Projects'
    },
    ideas: {
        es: 'Mis ideas',
        en: 'My Ideas'
    },
    contact: {
        es: 'Contacto',
        en: 'Contact'
    },
}
export default {
    name: 'Menu',
    props: {
        current: {
            type: String,
            default: ''
        },
        lang: {
            type: String,
            default: 'es'
        }
    },
    data() {
        return {
            diccionario: {
                home: {
                    es: 'Inicio',
                    en: 'Home'
                },
                about: {
                    es: 'Mi vida',
                    en: 'My Life'
                },
                jobs: {
                    es: 'Mi trabajo',
                    en: 'My Employers'
                },
                projects: {
                    es: 'Mis proyectos',
                    en: 'My Projects'
                },
                ideas: {
                    es: 'Mis ideas',
                    en: 'My Ideas'
                },
                contact: {
                    es: 'Contacto',
                    en: 'Contact'
                },
            }
        };
    },
    methods: {
        expandCollapse() {
            console.log('🍂console');
        }
    },
};

</script>