const getCategoryData = () => {
  const {
    urls
  } = global.crawler

  const [real, needRequest, hasGotten, hasCreated] = [[], [], [], []]
  for (const [key, value] of urls.entries()) {
    if (value !== 0) {
      real.push(key)

      switch (value) {
        case 1:
          needRequest.push(key)
          break

        case 2:
          hasGotten.push(key)
          break

        case 3:
          hasCreated.push(key)
          break
      }
    }
  }

  return {
    real, needRequest, hasGotten, hasCreated
  }
}

const update = (url, status) => {
  const {
    urls
  } = global.crawler

  urls.set(url, status)
}

const init = (data) => {
  const {
    domainBlackList, urls
  } = global.crawler

  data.forEach((resource, i) => {
    if (!urls.has(i)) {
      if (domainBlackList.some(item => resource.indexOf(item) > -1)) {
        urls.set(resource, 0)
      } else {
        urls.set(resource, 1)
      }
    }
  })
}

module.exports = {
  init,
  update,
  getCategoryData
}
