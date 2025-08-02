// Configure your import map in config/importmap.rb. Read more: https://github.com/rails/importmap-rails
import "@hotwired/turbo-rails"


import "trix"
import "@rails/actiontext"

import jquery from 'jquery'
window.$ = jquery
import axios from 'axios'

const handleHeartDisplay = (hasLiked) => {
  if (hasLiked) {
    $('.active-heart').removeClass('hidden')
  } else {
    $('.inactive-heart').removeClass('hidden')
  }
}

document.addEventListener('turbo:load', () => {
  const dataset = $('#article-show').data()
  const articleId = dataset.articleId
  axios.get(`/articles/${articleId}/like`)
    .then((response) => {
      const hasLiked = response.data.hasLiked
      handleHeartDisplay(hasLiked)
    })
})
