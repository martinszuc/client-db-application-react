const path = require('path');

module.exports = {
    webpack: {
        alias: {
            '@api': path.resolve(__dirname, 'src/api/'),
            '@firebaseDir': path.resolve(__dirname, 'src/api/firebase/'),
            '@repositories': path.resolve(__dirname, 'src/api/repositories/'),
            '@app': path.resolve(__dirname, 'src/app/'),
            '@assets': path.resolve(__dirname, 'src/app/assets/'),
            '@styles': path.resolve(__dirname, 'src/app/assets/styles/'),
            '@contexts': path.resolve(__dirname, 'src/app/contexts/'),
            '@hooks': path.resolve(__dirname, 'src/app/hooks/'),
            '@routes': path.resolve(__dirname, 'src/app/routes/'),
            '@features': path.resolve(__dirname, 'src/features/'),
            '@admin': path.resolve(__dirname, 'src/features/admin/'),
            '@publicComponents': path.resolve(__dirname, 'src/features/public/components'),
            '@adminComponents': path.resolve(__dirname, 'src/features/admin/components/'),
            '@sharedComponents': path.resolve(__dirname, 'src/features/shared/components/'),
            '@adminPages': path.resolve(__dirname, 'src/features/admin/pages/'),
            '@publicPages': path.resolve(__dirname, 'src/features/public/pages/'),
            '@shared': path.resolve(__dirname, 'src/features/shared/'),
            '@utils': path.resolve(__dirname, 'src/utils/'),
            '@i18n': path.resolve(__dirname, 'src/i18n/')
        }
    },
    jest: {
        configure: {
            moduleNameMapper: {
                '^@api/(.*)$': '<rootDir>/src/api/$1',
                '^@firebaseDir/(.*)$': '<rootDir>/src/api/firebase/$1',
                '^@repositories/(.*)$': '<rootDir>/src/api/repositories/$1',
                '^@app/(.*)$': '<rootDir>/src/app/$1',
                '^@assets/(.*)$': '<rootDir>/src/app/assets/$1',
                '^@styles/(.*)$': '<rootDir>/src/app/assets/styles/$1',
                '^@contexts/(.*)$': '<rootDir>/src/app/contexts/$1',
                '^@hooks/(.*)$': '<rootDir>/src/app/hooks/$1',
                '^@routes/(.*)$': '<rootDir>/src/app/routes/$1',
                '^@features/(.*)$': '<rootDir>/src/features/$1',
                '^@admin/(.*)$': '<rootDir>/src/features/admin/$1',
                '^@publicComponents/(.*)$': '<rootDir>/src/features/public/components$1',
                '^@adminComponents/(.*)$': '<rootDir>/src/features/admin/components/$1',
                '^@sharedComponents/(.*)$': '<rootDir>/src/features/shared/components/$1',
                '^@adminPages/(.*)$': '<rootDir>/src/features/admin/pages/$1',
                '^@publicPages/(.*)$': '<rootDir>/src/features/public/pages/$1',
                '^@shared/(.*)$': '<rootDir>/src/features/shared/$1',
                '^@utils/(.*)$': '<rootDir>/src/utils/$1',
                '^@i18n/(.*)$': '<rootDir>/src/i18n/$1'
            }
        }
    }
};
