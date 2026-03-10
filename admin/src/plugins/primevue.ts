import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { definePreset } from '@primeuix/themes'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import type { App } from 'vue'

const TumainiPreset = definePreset(Aura, {
    primitive: {
        tumainiAmber: {
            50:  '#fdf8f3',
            100: '#faeee0',
            200: '#f4d6b8',
            300: '#ecba88',
            400: '#e09456',
            500: '#c8712e',
            600: '#b56225',
            700: '#9b5520',
            800: '#7c4319',
            900: '#663815',
            950: '#3d200b',
        },
    },
    semantic: {
        primary: {
            50:  '{tumainiAmber.50}',
            100: '{tumainiAmber.100}',
            200: '{tumainiAmber.200}',
            300: '{tumainiAmber.300}',
            400: '{tumainiAmber.400}',
            500: '{tumainiAmber.500}',
            600: '{tumainiAmber.600}',
            700: '{tumainiAmber.700}',
            800: '{tumainiAmber.800}',
            900: '{tumainiAmber.900}',
            950: '{tumainiAmber.950}',
        },
        colorScheme: {
            light: {
                surface: {
                    0:   '#ffffff',
                    50:  '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                    950: '#0c0a09',
                },
                primary: {
                    color: '{tumainiAmber.500}',
                    contrastColor: '#ffffff',
                    hoverColor: '{tumainiAmber.600}',
                    activeColor: '{tumainiAmber.700}',
                },
                highlight: {
                    background: '{tumainiAmber.50}',
                    focusBackground: '{tumainiAmber.100}',
                    color: '{tumainiAmber.700}',
                    focusColor: '{tumainiAmber.800}',
                },
            },
        },
        borderRadius: {
            none: '0',
            xs: '2px',
            sm: '6px',
            md: '8px',
            lg: '10px',
            xl: '14px',
        },
    },
    components: {
        datatable: {
            headerCell: {
                background: '#faf7f4',
                hoverBackground: '#f3ede6',
                borderColor: '#e7e5e4',
                padding: '0.625rem 0.875rem',
            },
            row: {
                background: '#ffffff',
                hoverBackground: '#fdf8f3',
                stripedBackground: '#faf7f4',
            },
            bodyCell: {
                borderColor: '#f3ede6',
                padding: '0.625rem 0.875rem',
            },
        },
        paginator: {
            navButton: {
                hoverBackground: '#f3ede6',
                borderRadius: '8px',
            },
        },
    },
})

export function setupPrimeVue(app: App) {
    app.use(PrimeVue, {
        theme: {
            preset: TumainiPreset,
            options: {
                darkModeSelector: false,
                cssLayer: false,
            },
        },
    })
    app.use(ToastService)
    app.use(ConfirmationService)
}
