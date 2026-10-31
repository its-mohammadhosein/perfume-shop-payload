import type { Metadata } from 'next'
import Link from 'next/link'

import { CheckoutSteps } from '@/components/commerce/CheckoutSteps'
import { Button } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { Field, fieldClass, labelClass, Required } from '@/components/ui/Field'
import { PageTitle } from '@/components/ui/PageTitle'
import { formatPrice } from '@/components/ui/Price'
import { StaticForm } from '@/components/ui/StaticForm'
import { checkoutOrder, getProduct } from '@/data'
import { pageMetadata } from '@/utilities/pageMetadata'

export const metadata: Metadata = pageMetadata({
  title: 'Checkout',
  path: '/checkout',
  noIndex: true,
})

const payments = [
  {
    id: 'bacs',
    label: 'Direct bank transfer',
    text: 'Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.',
  },
  { id: 'cheque', label: 'Check payments' },
  { id: 'cod', label: 'Cash on delivery' },
]

const half = 'md:basis-[calc(50%-10px)]'

/** Static checkout: billing form + order review with the DUMMY order from `data/pages.ts`. */
export default function CheckoutPage() {
  const lines = checkoutOrder.items.map(({ slug, quantity }) => {
    const product = getProduct(slug)!
    return { product, quantity, total: product.price * quantity }
  })
  const subtotal = lines.reduce((sum, l) => sum + l.total, 0)
  const total = subtotal + checkoutOrder.shipping

  return (
    <>
      <PageTitle>
        <h1 className="sr-only">Checkout</h1>
        <CheckoutSteps current="checkout" />
      </PageTitle>

      <Container className="py-10">
        <StaticForm
          aria-label="Checkout"
          className="grid items-start gap-10 lg:grid-cols-2 lg:gap-[30px]"
          sentMessage="Thank you. Your order has been received."
        >
          <section aria-labelledby="billing-title">
            <h2 className="mb-5 text-[22px] leading-[1.4]" id="billing-title">
              Billing details
            </h2>
            <div className="flex flex-wrap gap-x-5">
              <Field
                autoComplete="given-name"
                className={`basis-full ${half}`}
                label="First name"
                required
              />
              <Field
                autoComplete="family-name"
                className={`basis-full ${half}`}
                label="Last name"
                required
              />
              <Field
                autoComplete="organization"
                className="basis-full"
                label="Company name (optional)"
              />
              <Field
                autoComplete="country-name"
                className="basis-full"
                defaultValue="United States (US)"
                label="Country / Region"
                required
              />
              <Field
                autoComplete="address-line1"
                className="mb-2.5 basis-full"
                label="Street address"
                placeholder="House number and street name"
                required
              />
              <p className="mb-[15px] basis-full">
                <input
                  aria-label="Apartment, suite, unit, etc. (optional)"
                  autoComplete="address-line2"
                  className={fieldClass}
                  placeholder="Apartment, suite, unit, etc. (optional)"
                  type="text"
                />
              </p>
              <Field
                autoComplete="address-level2"
                className="basis-full"
                label="Town / City"
                required
              />
              <Field
                autoComplete="address-level1"
                className={`basis-full ${half}`}
                label="State"
                required
              />
              <Field
                autoComplete="postal-code"
                className={`basis-full ${half}`}
                label="ZIP Code"
                required
              />
              <Field autoComplete="tel" className="basis-full" label="Phone" required type="tel" />
              <Field
                autoComplete="email"
                className="basis-full"
                label="Email address"
                required
                type="email"
              />
            </div>

            <h2 className="mt-5 mb-5 text-[22px] leading-[1.4]">Additional information</h2>
            <Field
              className="mb-0"
              label="Order notes (optional)"
              placeholder="Notes about your order, e.g. special notes for delivery."
              textarea
            />
          </section>

          <section
            aria-labelledby="order-title"
            className="bg-muted p-[30px] lg:sticky lg:top-[100px]"
          >
            <h2 className="mb-5 text-[22px] leading-[1.4]" id="order-title">
              Your order
            </h2>
            <table className="mb-[30px] w-full text-left">
              <thead>
                <tr className="border-b border-line">
                  <th className="pb-[15px] text-base font-semibold text-title uppercase">
                    Product
                  </th>
                  <th className="pb-[15px] text-end text-base font-semibold text-title uppercase">
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody>
                {lines.map(({ product, quantity, total }) => (
                  <tr key={product.slug} className="border-b border-line">
                    <td className="py-[15px] pr-5">
                      {product.name}{' '}
                      <strong className="font-semibold text-title">× {quantity}</strong>
                    </td>
                    <td className="py-[15px] text-end font-medium text-title">
                      {formatPrice(total)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-b border-line">
                  <th className="py-[15px] font-semibold text-title">Subtotal</th>
                  <td className="py-[15px] text-end font-medium text-title">
                    {formatPrice(subtotal)}
                  </td>
                </tr>
                <tr className="border-b border-line">
                  <th className="py-[15px] font-semibold text-title">Shipping</th>
                  <td className="py-[15px] text-end">Free shipping</td>
                </tr>
                <tr>
                  <th className="pt-[15px] font-semibold text-title">Total</th>
                  <td className="pt-[15px] text-end text-xl font-semibold text-title">
                    {formatPrice(total)}
                  </td>
                </tr>
              </tfoot>
            </table>

            <fieldset className="mb-5">
              <legend className="sr-only">Payment method</legend>
              {payments.map((p, i) => (
                <div key={p.id} className="border-b border-line py-[15px] first:pt-0">
                  <label className="flex cursor-pointer items-center gap-2.5 font-semibold text-title">
                    <input defaultChecked={i === 0} name="payment" type="radio" value={p.id} />
                    {p.label}
                  </label>
                  {p.text && <p className="mt-2.5 text-sm">{p.text}</p>}
                </div>
              ))}
            </fieldset>

            <p className="mb-5 text-sm">
              Your personal data will be used to process your order, support your experience
              throughout this website, and for other purposes described in our{' '}
              <Link className="font-semibold" href="/privacy">
                privacy policy
              </Link>
              .
            </p>
            <label className={`${labelClass} mb-5 flex items-start gap-2.5 font-normal`}>
              <input className="mt-1.5" required type="checkbox" />
              <span>
                I have read and agree to the website{' '}
                <Link className="font-semibold" href="/terms">
                  terms and conditions
                </Link>{' '}
                <Required />
              </span>
            </label>
            <Button fullWidth size="lg" type="submit">
              Place order
            </Button>
          </section>
        </StaticForm>
      </Container>
    </>
  )
}
