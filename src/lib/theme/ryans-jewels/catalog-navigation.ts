import type { AdminMenuItem } from './admin-menu.js'

// Hierarchy supplied in ryan-jewellers-designs-2026-09-21.csv; links use verified store category slugs.
export const catalogNavigation =[
  {
    "name": "Bracelets",
    "href": "/products?categories=bracelets",
    "children": [
      {
        "name": "Bolo Bracelets",
        "href": "/products?categories=bolo-bracelets%2Cbracelets-bolo-bracelets"
      },
      {
        "name": "Fancy Bracelets",
        "href": "/products?categories=fancy-bracelets%2Cbracelets-fancy-bracelets"
      },
      {
        "name": "Gemstone Bracelets",
        "href": "/products?categories=gemstone-bracelets%2Cbracelets-gemstone-bracelets"
      },
      {
        "name": "Tennis Bracelets",
        "href": "/products?categories=tennis-bracelets%2Cbracelets-tennis-bracelets"
      }
    ]
  },
  {
    "name": "Earrings",
    "href": "/products?categories=women",
    "children": [
      {
        "name": "Cluster -Circle Earrings",
        "href": "/products?categories=cluster-circle-earrings%2Cwomen-cluster-circle-earrings"
      },
      {
        "name": "Color Stone Earrings",
        "href": "/products?categories=color-stone-earrings%2Cwomen-color-stone-earrings"
      },
      {
        "name": "Fancy Earrings",
        "href": "/products?categories=fancy-earrings%2Cwomen-fancy-earrings"
      },
      {
        "name": "Halo Earrings",
        "href": "/products?categories=halo-earrings%2Cwomen-halo-earrings"
      },
      {
        "name": "Hoops and Huggies Earrings",
        "href": "/products?categories=hoops-huggies-earrings%2Cwomen-hoops-and-huggies-earrings"
      },
      {
        "name": "Micropave Earrings",
        "href": "/products?categories=micropave-earrings%2Cwomen-micropave-earrings"
      },
      {
        "name": "shapes and Symbolic Earrings",
        "href": "/products?categories=shapes-symbolic-earrings%2Cwomen-shapes-and-symbolic-earrings"
      },
      {
        "name": "Studs",
        "href": "/products?categories=studs%2Cwomen-studs"
      }
    ]
  },
  {
    "name": "Necklaces",
    "href": "/products?search=Necklaces",
    "children": [
      {
        "name": "Fancy Necklaces",
        "href": "/products?search=Fancy+Necklaces"
      },
      {
        "name": "Gemstone Necklaces",
        "href": "/products?search=Gemstone+Necklaces"
      },
      {
        "name": "Graduate Necklaces",
        "href": "/products?search=Graduate+Necklaces"
      },
      {
        "name": "Tennis Necklaces",
        "href": "/products?search=Tennis+Necklaces"
      }
    ]
  },
  {
    "name": "Pendants",
    "href": "/products?categories=pendants",
    "children": [
      {
        "name": "Circle Pendants",
        "href": "/products?categories=circle-pendants%2Cpendants-circle-pendants"
      },
      {
        "name": "Fancy Pendants",
        "href": "/products?categories=fancy-pendants%2Cpendants-fancy-pendants"
      },
      {
        "name": "Journey Pendants",
        "href": "/products?categories=journey-pendants%2Cpendants-journey-pendants"
      },
      {
        "name": "Memory Pendants",
        "href": "/products?categories=memory-pendants%2Cpendants-memory-pendants"
      },
      {
        "name": "Religious Pendants",
        "href": "/products?categories=pendants-religious-pendants"
      },
      {
        "name": "Solitaire Pendants",
        "href": "/products?categories=pendants-everyday-pendants-solitaire-pendants%2Csolitaire-pendants%2Cpendants-solitaire-pendants"
      }
    ]
  },
  {
    "name": "Rings",
    "href": "/products?categories=engagement,mens-rings-679,fancy-rings,color-stone-rings,religious-rings,eternity-bands",
    "children": [
      {
        "name": "Color Stone Rings",
        "href": "/products?categories=color-stone-rings"
      },
      {
        "name": "Engagement Rings",
        "href": "/products?categories=engagement"
      },
      {
        "name": "Engagement Sets",
        "href": "/products?categories=engagement&search=Engagement+Sets"
      },
      {
        "name": "Eternity Bands",
        "href": "/products?categories=eternity-bands"
      },
      {
        "name": "Fancy Rings",
        "href": "/products?categories=fancy-rings"
      },
      {
        "name": "Initial Rings",
        "href": "/products?categories=engagement&search=Initial+Rings"
      },
      {
        "name": "Mens Rings",
        "href": "/products?categories=mens-rings-679"
      },
      {
        "name": "Religious Rings",
        "href": "/products?categories=religious-rings"
      },
      {
        "name": "Solitaire Rings",
        "href": "/products?categories=engagement-shop-by-style-solitaire-rings"
      },
      {
        "name": "Three Stone Rings",
        "href": "/products?categories=engagement-shop-by-style-three-stone"
      },
      {
        "name": "Wedding Bands",
        "href": "/products?categories=engagement&search=Wedding+Bands"
      }
    ]
  }
]

const categoryOrder = ['Rings', 'Earrings', 'Pendants', 'Bracelets', 'Necklaces']
catalogNavigation.sort((a, b) => categoryOrder.indexOf(a.name) - categoryOrder.indexOf(b.name))

export const catalogMegaMenu: AdminMenuItem[] = catalogNavigation.map((category) => ({
 name: category.name, href: category.href,
 children: [
  { name: 'Shop by style', href: category.href, children: category.children.slice(0, 6) },
  ...(category.children.length > 6 ? [{ name: 'More styles', href: category.href, children: category.children.slice(6) }] : [])
 ]
}))
