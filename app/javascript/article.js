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

const handleCommentForm = () => {
  $('.show-comment-form').on('click', () => {
      $('.show-comment-form').addClass('hidden')
      $('.comment-text-area').removeClass('hidden')
    })
}

const appendNewComment = (comment) => {
  $('.comments-container').append(
  `<div class="article-comment"><p>${comment.content}</p></div>`
  )
}

document.addEventListener('turbo:load', () => {
  const articleShow = document.getElementById('article-show')
  if (articleShow) {
    const dataset = $('#article-show').data()
    const articleId = dataset.articleId

    axios.get(`/articles/${articleId}/comments`)
    .then((response) => {
      const comments = response.data
      comments.forEach((comment) => {
        appendNewComment(comment)
      })
    })

    handleCommentForm()

    $('.add-comment-button').on('click', () => {
      const content = $('#comment_content').val()
      if (!content) {
        window.alert('コメントを入力してください')
      } else {
        axios.post(`/articles/${articleId}/comments`, {
          comment: {content: content}
        })
        .then((response) => {
          const comment = response.data
          appendNewComment(comment)
        $('#comment_content').val('')
        })
      }
    })

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
      })
    }else{
      console.log('#article-show要素が見つかりませんでした')
    }
})