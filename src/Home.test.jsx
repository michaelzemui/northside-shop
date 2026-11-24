import { readFileSync } from 'node:fs'
import { renderToString } from 'react-dom/server'
import { expect, test, vi } from 'vitest'
import App from './App.jsx'
import Home from './Home.jsx'

const shop = {
  name: 'Test Bakery',
  claim: 'Bread.',
  address: { street: '1 Test Street', city: 'Testville' },
  phone: '+49 30 0000 0000',
  email: 'shop@bakery.example',
  openingHours: [
    { day: 'Monday', hours: '08:00–17:00' },
    { day: 'Saturday', hours: '09:00–12:00' },
    { day: 'Sunday', hours: null },
  ],
}

const render = () => renderToString(<Home shop={shop} onNavigate={() => {}} />)

function findElement(node, type) {
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findElement(child, type)
      if (found) return found
    }
    return null
  }
  if (!node || typeof node !== 'object') return null
  if (node.type === type) return node
  return findElement(node.props?.children, type)
}

test('the home page shows the shop name as its only heading in a hero with the claim below', () => {
  const html = render()
  expect(html.match(/<h1/g)).toHaveLength(1)
  expect(html).toMatch(/<section class="home-hero"><h1>Test Bakery<\/h1>/)
  expect(html.indexOf('Bread.')).toBeGreaterThan(html.indexOf('<h1>Test Bakery</h1>'))
})

test('the home page shows a visit teaser with address and a phone link after the claim', () => {
  const html = render()
  expect(html).toContain('Visit us')
  expect(html).toContain('1 Test Street')
  expect(html).toContain('Testville')
  expect(html).toContain('href="tel:+493000000000"')
  expect(html.indexOf('Visit us')).toBeGreaterThan(html.indexOf('Bread.'))
})

test('the home call-to-action asks to show the contact page', () => {
  const onNavigate = vi.fn()
  const button = findElement(Home({ shop, onNavigate }), 'button')
  expect(button).not.toBeNull()
  button.props.onClick()
  expect(onNavigate).toHaveBeenCalledTimes(1)
  expect(onNavigate).toHaveBeenCalledWith('contact')
})

test('the app shows the home call-to-action and still marks Home in the navigation', () => {
  const html = renderToString(<App shop={shop} />)
  expect(html).toContain('Opening hours &amp; contact')
  expect(html).toMatch(/aria-current="page"[^>]*>Home</)
})

test('the home styles are scoped to home markup and use the shop palette', () => {
  const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
  const original = [
    ':root',
    'body',
    'header',
    'nav button',
    "nav button[aria-current='page']",
    'main',
    'address',
    'a',
    'dl',
    'dd',
  ]
  const selectors = [...css.matchAll(/([^{}]+)\{/g)]
    .map((m) => m[1].trim())
    .filter((s) => !s.startsWith('@'))
    .flatMap((s) => s.split(',').map((part) => part.trim()))
  expect(selectors.filter((s) => !original.includes(s) && !s.startsWith('.home'))).toEqual([])
  const rule = (selector) =>
    css.match(new RegExp(`(^|\\n)\\s*${selector.replace('.', '\\.')}\\s*\\{([^}]*)\\}`))?.[2] ?? ''
  expect(rule('.home-hero')).toMatch(/background:\s*#2b2118/)
  expect(rule('.home-cta')).toMatch(/background:\s*#9a4b12/)
})
