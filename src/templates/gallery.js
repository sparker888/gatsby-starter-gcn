import React from 'react'
import Link from 'gatsby-link'
import Img from 'gatsby-image'
import find from "lodash.find"
import Helmet from 'react-helmet'
import Up from '../components/up'
import BgImg from '../components/background'

const GalleryTemplate = ({data}) => {

  const {
    title,
    id,
    date,
    category,
    location,
    slug,
    description,
    cover,
    images
  } = data.contentfulGallery;

  const galleryIndex = find(
    data.allContentfulGallery.edges,
    ({ node: gallery }) => gallery.id === id
  );

  return(
    <div>

    <Helmet>
      <title>{title} - Designers West Interiors</title>
      <meta name="description" content={description.internal.content} />
      <meta property="og:title" content={title + " - Designers West Interiors"}/>
      <meta property="og:image" content={cover.sizes.src} />
      <meta property="og:description" content={description.internal.content} />
      <meta property="og:image:width" content="1800" />
      <meta property="og:image:height" content="1200" />
      <meta property="og:url" content={"https://www.knw.io/" + slug + "/"} />
    </Helmet>

    <div className="post">
      <div className="post-cover">
        <BgImg height={'75vh'} sizes={cover.sizes} alt={cover.title} title={cover.title} backgroundColor={"#f1f1f1"} />
      </div>
      <div className="post-info">
        <div className="post-info__left">
          <h2 className="post-info-title">Details</h2>
          <h3 className="post-category"><Link to={"/" + category + "/"}>{category}</Link></h3>
          <h3 className="post-location">{location}</h3>
          {galleryIndex.previous && (<Link className="post-previous" to={"/" + galleryIndex.previous.slug + "/"}>Previous</Link>)}
          {galleryIndex.next && (<Link className="post-next" to={"/" + galleryIndex.next.slug + "/"}>Next</Link>)}
        </div>
        <div className="post-info__right">
          <div className="post-description" dangerouslySetInnerHTML={{ __html: description.childMarkdownRemark.html }} />
        </div>
      </div>
      <ul className="post-images">
        {images && (
          images.map((images, index) => (
            <li key={index}>
              <Img sizes={images.sizes} alt={images.title} title={images.title} outerWrapperClassName={images.description} backgroundColor={"#f1f1f1"} />
            </li>
          ))
        )}
      </ul>
      {galleryIndex.next && (
      <Link className="post-preview" to={"/" + galleryIndex.next.slug + "/"}>
        <h4 className="post-preview__title">Next</h4>
        <BgImg height={'40vh'} sizes={galleryIndex.next.cover.sizes} alt={galleryIndex.next.cover.title} title={galleryIndex.next.cover.title} backgroundColor={"#ffffff"} />
      </Link>)}
    </div>
    <Up />
  </div>

  )
}

export const query = graphql`
  query GalleryQuery($slug: String!) {
    contentfulGallery(slug: {eq: $slug}) {
      title
      id
      slug
      category
      location
      date(formatString: "M.DD.YYYY")
      description {
        internal {
          content
        }
        childMarkdownRemark {
          html
        }
      }
      cover {
        title
        sizes(maxWidth: 1800) {
          ...GatsbyContentfulSizes_withWebp_noBase64
        }
      }
      images {
        title
        description
        sizes(maxWidth: 1800) {
          ...GatsbyContentfulSizes_withWebp_noBase64
        }
      }
    }
    allContentfulGallery(limit: 1000, sort: { fields: [date], order: DESC })  {
        edges {
          node {
            id
          }
          previous {
            slug
            title
          }
          next {
            slug
            title
            cover {
              sizes(maxWidth: 1800) {
                ...GatsbyContentfulSizes_withWebp_noBase64
              }
            }
          }
        }
      }
  }
`

export default GalleryTemplate