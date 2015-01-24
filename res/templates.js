/**
 * Created with JetBrains WebStorm.
 * User: Bloodyaugust
 * Date: 12/10/13
 * Time: 1:40 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {
    templates = {
        modal: function () {
            div(
                {'class': 'modal'}
            )
        },
        menu: function () {
            div(
                {'class': 'menu'},
                div(
                    {'class': 'game-title'},
                    'Menu'
                ),
                div(
                    {'class': 'button', 'id': 'game', 'onClick': 'logPlay();'},
                    'Play'
                ),
                div(
                    {'class': 'button', 'id': 'settings'},
                    'Settings'
                ),
                div(
                    {'class': 'button', 'id': 'about'},
                    'About'
                )
            )
        },
        score: function () {
            div(
                {'class': 'menu'},
                div(
                    {'class': 'game-title'},
                    'Score'
                ),
                div(
                    {'class': 'button', 'id': 'menu'},
                    'Menu'
                ),
                div(
                    {'class': 'button'},
                    a(
                        {'class': 'twitter-share-button', 'href': 'https://twitter.com/share', 'data-via': 'twitterdev', 'style': 'color:#0C0;'},
                        'Tweet Your Score!'
                    )
                )
            )
        }
    };
})();