module.exports = {
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#363151',
            'success-color': '#07885B',
            'warning-color': '#FDA94C',
            'error-color': '#DD2705',
            'link-color': '#000000',
            'body-background': '#FAFBFF',
            'font-size-base': '16px',
            'font-family':
              "'Open Sans', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
            'comment-author-name-color': '#373151',
            'comment-author-time-color': '#969696',
            'comment-font-size-base': '14px',
            'comment-font-size-sm': '14px'
          },
          javascriptEnabled: true
        }
      },

      sass: {
        prependData: `
            @import "./src/css/variables.scss";
        `
      }
    }
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
};
