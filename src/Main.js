const h = require('react-hyperscript')
const {observer} = require('mobx-react')

const {loadUser} = require('./state')
const state = require('./state')
const log = require('./log')

module.exports = observer(() => {
  return (
    h('div', [
      h('nav.navbar.is-white', [
        h('.navbar-brand', [
          h('a.navbar-item', {href: '#!/'}, [
            h('img', {src: './icon.png'})
          ]),
          h('a.navbar-item', {href: '#!/'}, 'Qontent')
        ]),
        h('.navbar-end', [
          window.qontent.liveSiteURL
            ? h('a.navbar-item', {
              href: window.qontent.liveSiteURL,
              title: window.qontent.liveSiteURL,
              target: '_blank'
            }, [
              h('span.icon', [ h('i.fa.fa-external-link-square') ]),
              'Live site'
            ])
            : null,
          state.slug.get()
            ? h('a.navbar-item', {
              href: `https://github.com/${state.slug.get()}`,
              title: state.slug.get(),
              target: '_blank'
            }, [
              h('span.icon', [ h('i.fab.fa-github-square') ]),
              'Browse repository'
            ])
            : null,
          state.loggedUser.get()
            ? h('.navbar-item', [
              state.loggedUser.get(),
              h('span', {style: {marginRight: '5px'}}, ', '),
              h('a', {
                onClick: () =>
                  window.qontent.authorizationRemove()
                    .then(loadUser)
              }, 'logout')
            ])
            : h('a.navbar-item', {
              onClick: () => {
                window.qontent.authorizationInit()
                  .then(() => {
                    log.success('Got GitHub token and stored it locally.')
                    loadUser()
                  })
                  .catch(log.error)
              }
            }, 'authorize on GitHub')
        ])
      ]),
      h('div.container', [
        h(components[state.route.get().componentName])
      ])
    ])
  )
})

const components = require('../components')
