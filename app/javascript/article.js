import jquery from 'jquery'
window.$ = jquery
import axios from 'axios'
import Rails from "@rails/ujs"
Rails.start()

axios.defaults.headers.common['X-CSRF-Token'] = Rails.csrfToken()
const handleHeartDisplay = (hasLiked) => {
  if (hasLiked) {
    $('.active-heart').removeClass('hidden')
  } else {
    $('.inactive-heart').removeClass('hidden')
  }
}

document.addEventListener('turbo:load', () => {
  const articleShow = document.getElementById('article-show');
  if (articleShow) {
    const dataset = $('#article-show').data()
    const articleId = dataset.articleId
    axios.get(`/articles/${articleId}/like`)
      .then((response) => {
        const hasLiked = response.data.hasLiked
        handleHeartDisplay(hasLiked)
      })

      $('.inactive-heart').on('click', () => {
        axios.post(`/articles/${articleId}/like`)
          .then((response) => {
            if (response.data.status === 'ok') {
              $('.active-heart').removeClass('hidden')
              $('.inactive-heart').addClass('hidden')
            }
          })
          .catch((e) => {
            window.alert('Error')
            console.log(e)
          })
      })

      $('.active-heart').on('click', () => {
        axios.delete(`/articles/${articleId}/like`)
          .then((response) => {
            if (response.data.status === 'ok') {
              $('.active-heart').addClass('hidden')
              $('.inactive-heart').removeClass('hidden')
            }
          })
          .catch((e) => {
            window.alert('Error')
            console.log(e)
          })
      });
    }else{
      console.log('#article-show要素が見つかりませんでした');
    }
})