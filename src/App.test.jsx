import { renderToString } from 'react-dom/server'
import { expect, test } from 'vitest'
import App from './App.jsx'

const shop = {
  name: 'Test Bakery',
  claim: 'Bread.',
  address: { street: '1 Test Street', city: 'Testville' },
  phone: '+49 30 0000 0000',
  email: 'shop@bakery.example',
  openingHours: [],
}

function footerOf(html) {
  const start = html.indexOf('<footer')
  const end = html.indexOf('</footer>')
  return start === -1 || end === -1 ? '' : html.slice(start, end + '</footer>'.length)
}

test.each(['home', 'contact'])('the %s page ends with the shop footer', (start) => {
  const html = renderToString(<App shop={shop} start={start} />)
  const footer = footerOf(html)
  expect(html.match(/<footer/g)).toHaveLength(1)
  expect(html.indexOf('<footer')).toBeGreaterThan(html.indexOf('</main>'))
  expect(footer).toContain(`© ${new Date().getFullYear()} Test Bakery`)
  expect(footer).toContain('href="mailto:shop@bakery.example"')
  expect(footer).toMatch(/>shop@bakery\.example<\/a>/)
})
