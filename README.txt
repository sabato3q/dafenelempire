DAFENEL HERBAL TEA - SUPABASE READY WEBSITE

This package connects the existing Dafenel Herbal Tea design to your Supabase project.

WHAT IS INCLUDED
- index.html - homepage
- shop.html - products loaded from Supabase
- benefits.html - benefits page
- testimonials.html - testimonials loaded from Supabase
- about.html - about page
- contact.html - contact/social information
- admin.html - secure Supabase admin dashboard
- admin.js - admin authentication + product/order/testimonial management
- supabase-config.js - Supabase project URL + publishable key
- site.js - public database loading
- assets/ - existing Dafenel images/logo

ADMIN LOGIN
Use the email/password you created in Supabase Authentication > Users.
That user must have role='admin' in public.profiles (already set for the UID you provided).

GITHUB
1. Create/open your Dafenel website repository on GitHub.
2. Upload ALL files and folders from this package, keeping the assets folder.
3. Commit the changes.
4. For GitHub Pages, set the repository Pages source to the branch/folder containing index.html.

IMPORTANT
The Supabase publishable key is intended for browser use. Database protection comes from Row Level Security.
Never put a Supabase service-role/secret key in this website.

CURRENT BUSINESS DETAILS
WhatsApp: 0596502626
Calls: 0500922299, 0244941097
Location: Kumasi, Daban Newsite
TikTok: Magical tea
Facebook: Dafenel's Herbal Tea

NEXT DATABASE STEP
The current SQL creates products, testimonials, orders and profiles. For public customer order creation, add the following policy in Supabase SQL Editor:

create policy "Public can create orders"
on public.orders
for insert
to anon, authenticated
with check (true);

Then the customer order form can be connected to the orders table. The current website uses WhatsApp ordering for the fastest customer flow.
