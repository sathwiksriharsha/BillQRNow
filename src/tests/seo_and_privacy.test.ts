import {describe,it,expect} from 'vitest';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join,relative,sep} from 'node:path';
import {routes,relatedFor} from '../data/routes';
const dist=join(process.cwd(),'dist');
function htmlFiles(dir:string):string[]{return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const path=join(dir,entry.name);return entry.isDirectory()?htmlFiles(path):entry.name.endsWith('.html')?[path]:[];});}
const files=existsSync(dist)?htmlFiles(dist):[];
const text=(file:string)=>readFileSync(file,'utf8');
const attr=(html:string,pattern:RegExp)=>html.match(pattern)?.[1]||'';
const decodeEntities=(value:string)=>value.replace(/&#38;|&amp;/g,'&').replace(/&#39;|&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
function outputFor(pathname:string){const clean=decodeURIComponent(pathname.split(/[?#]/)[0]).replace(/^\/+|\/+$/g,'');return clean?join(dist,clean,'index.html'):join(dist,'index.html');}
describe('built SEO and privacy surface',()=>{
 it('contains Cloudflare and sitemap artifacts at the canonical host',()=>{for(const name of ['sitemap-index.xml','sitemap-0.xml','robots.txt','_headers','_redirects'])expect(existsSync(join(dist,name)),`${name} should be in dist`).toBe(true);const sitemap=text(join(dist,'sitemap-0.xml'));expect(sitemap).toContain('https://billqrnow.pages.dev/');expect(text(join(dist,'robots.txt'))).toContain('https://billqrnow.pages.dev/sitemap-index.xml');});
 it('builds at least 66 pages and keeps every route slug dot-free',()=>{expect(files.length).toBeGreaterThanOrEqual(66);expect(routes).toHaveLength(60);for(const route of routes)expect(route.slug).not.toContain('.');});
 it('uses unique titles, descriptions, canonicals, and exactly one H1 on every page',()=>{const titles:string[]=[],descriptions:string[]=[];for(const file of files){const html=text(file);titles.push(attr(html,/<title>(.*?)<\/title>/i));descriptions.push(attr(html,/<meta\s+name="description"\s+content="([^"]*)"/i));const canon=attr(html,/<link\s+rel="canonical"\s+href="([^"]*)"/i);expect(canon).toMatch(/^https:\/\/billqrnow\.pages\.dev\//);expect((html.match(/<h1(?:\s[^>]*)?>/gi)||[]).length,relative(dist,file)).toBe(1);}expect(titles.every(Boolean)).toBe(true);expect(descriptions.every(Boolean)).toBe(true);expect(new Set(titles).size).toBe(files.length);expect(new Set(descriptions).size).toBe(files.length);});
 it('includes matching Open Graph and Twitter card metadata on every page',()=>{
  for(const file of files){
   const html=text(file),page=relative(dist,file);
   const title=decodeEntities(attr(html,/<title>(.*?)<\/title>/i));
   const description=decodeEntities(attr(html,/<meta\s+name="description"\s+content="([^"]*)"/i));
   const canonical=attr(html,/<link\s+rel="canonical"\s+href="([^"]*)"/i);
   expect(attr(html,/<meta\s+property="og:type"\s+content="([^"]*)"/i),page).toBe('website');
   expect(attr(html,/<meta\s+property="og:site_name"\s+content="([^"]*)"/i),page).toBe('BillQRNow');
   expect(decodeEntities(attr(html,/<meta\s+property="og:title"\s+content="([^"]*)"/i)),page).toBe(title);
   expect(decodeEntities(attr(html,/<meta\s+property="og:description"\s+content="([^"]*)"/i)),page).toBe(description);
   expect(attr(html,/<meta\s+property="og:url"\s+content="([^"]*)"/i),page).toBe(canonical);
   expect(attr(html,/<meta\s+name="twitter:card"\s+content="([^"]*)"/i),page).toBe('summary_large_image');
   expect(decodeEntities(attr(html,/<meta\s+name="twitter:title"\s+content="([^"]*)"/i)),page).toBe(title);
   expect(decodeEntities(attr(html,/<meta\s+name="twitter:description"\s+content="([^"]*)"/i)),page).toBe(description);
  }
 });
 it('keeps every title within 75 characters and avoids repeated benefit words',()=>{
  for(const file of files){
   const title=decodeEntities(attr(text(file),/<title>(.*?)<\/title>/i)),page=relative(dist,file);
   expect(title.length,`${page}: ${title}`).toBeLessThanOrEqual(75);
   expect(title, page).toMatch(/\| BillQRNow$/);
   expect(title).not.toMatch(/Amount Fixed\s+—\s+Amount Fixed/i);
   expect(title).not.toMatch(/UPI QR Code\s+—\s+Embedded UPI QR/i);
   const noBrand=title.replace(/\s*\| BillQRNow$/,'');
   const offer=noBrand.match(/\s+\((Free, No Login|Free PDF)\)$/i)?.[1]||'';
   const core=offer?noBrand.replace(/\s+\((Free, No Login|Free PDF)\)$/i,''):noBrand;
   const split=core.split(' — ');
   const primaryText=split[0];
   const tokens=(part:string)=>part.toLowerCase().match(/[a-z0-9]+/g)||[];
   if(offer)expect(tokens(offer).filter(word=>tokens(primaryText).includes(word)),`${page}: ${title} offer`).toEqual([]);
   if(split.length===2){
    const primary=new Set(tokens(split[0]));
    const benefit=tokens(split[1]);
    expect(benefit.filter(word=>primary.has(word)),`${page}: ${title}`).toEqual([]);
   }
  }
  expect(decodeEntities(attr(text(outputFor('/us/rent-receipt-generator-us')),/<title>(.*?)<\/title>/i))).toBe('US Rent Receipt Generator (Free, No Login) | BillQRNow');
 });
 it('has no broken root-relative internal links across built pages',()=>{const broken:string[]=[];for(const file of files){const html=text(file);for(const match of html.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)"/gi)){const href=match[1];if(!existsSync(outputFor(href)))broken.push(`${relative(dist,file)} -> ${href}`);}}expect(broken).toEqual([]);});
 it('does not render forms that post financial data to a remote server',()=>{for(const file of files){const html=text(file);for(const match of html.matchAll(/<form\b([^>]*)>/gi)){const attrs=match[1];expect(attrs).not.toMatch(/method=["']?post/i);expect(attrs).not.toMatch(/action=["']https?:\/\//i);}}});
 it('renders route-specific compliance tables, four FAQs, and valid SoftwareApplication, FAQPage, and BreadcrumbList JSON-LD',()=>{
  for(const route of routes){
   const html=text(outputFor(`/${route.slug}`));
   expect(html,route.slug).toContain(`data-route-compliance="${route.slug}"`);
   const compliance=html.match(/<table[^>]*data-route-compliance[^>]*>([\s\S]*?)<\/table>/i)?.[1]||'';
   expect((compliance.match(/<tr\b/gi)||[]).length,`${route.slug} compliance rows`).toBe(5);
   expect((html.match(/data-faq-item=/g)||[]).length,`${route.slug} FAQ count`).toBe(4);
   const schemas=[...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/gi)].map(match=>JSON.parse(match[1]));
   expect(schemas.map(schema=>schema['@type'])).toEqual(expect.arrayContaining(['SoftwareApplication','FAQPage','BreadcrumbList']));
   const app=schemas.find(schema=>schema['@type']==='SoftwareApplication');
   const faq=schemas.find(schema=>schema['@type']==='FAQPage');
   const breadcrumb=schemas.find(schema=>schema['@type']==='BreadcrumbList');
   expect(app.offers.price).toBe('0.00');
   expect(app.offers.priceCurrency).toBe('INR');
   expect(faq.mainEntity).toHaveLength(4);
   expect(breadcrumb.itemListElement).toHaveLength(3);
   expect(html).toContain(`data-related-tools="${route.slug}"`);
   expect(html).toContain('Load Sample Data');
  }
 });
 it('keeps compliance tables distinct and related links inside the matching document silo',()=>{
  const complianceBodies:string[]=[];
  for(const route of routes){
   const html=text(outputFor(`/${route.slug}`));
   const body=html.match(/<tbody>([\s\S]*?)<\/tbody>/i)?.[1]||'';
   expect((body.match(/<tr\b/gi)||[]).length,`${route.slug} table rows`).toBe(4);
   complianceBodies.push(body);
   const section=html.match(/<section[^>]*data-related-tools="[^"]+"[^>]*>([\s\S]*?)<\/section>/i)?.[1]||'';
   const hrefs=[...section.matchAll(/<a\b[^>]*href="\/([^\"]+)"/gi)].map(match=>match[1]);
   expect(hrefs.length,`${route.slug} related links`).toBeGreaterThan(0);
   expect(hrefs.sort()).toEqual(relatedFor(route).map(related=>related.slug).sort());
  }
  expect(new Set(complianceBodies).size, 'route-specific compliance table bodies').toBe(routes.length);
 });
 it('links regional tax, customs, HR, GST, and payment tools to contextually related routes',()=>{
  const relatedSlugs=(slug:string)=>relatedFor(routes.find(route=>route.slug===slug)! ).map(route=>route.slug);
  expect(relatedSlugs('us/uk-vat-invoice-generator')).toContain('us/canada-gst-hst-invoice-generator');
  expect(relatedSlugs('us/uk-vat-invoice-generator')).not.toContain('us/commercial-invoice-generator');
  expect(relatedSlugs('us/commercial-invoice-generator')).not.toContain('upi-qr-code-generator');
  expect(relatedSlugs('experience-certificate-format-generator')).not.toContain('us/commercial-invoice-generator');
  expect(relatedSlugs('transport-bilty-lr-generator')).toContain('gst-invoice-generator');
  expect(relatedSlugs('upi-qr-code-generator')).toContain('upi-payment-link-generator');
 });
 it('uses current official reference rates for jewellery and Canada compliance tables',()=>{
  const jewellery=text(outputFor('/jewellery-gst-invoice-generator'));
  expect(jewellery).toContain('3% on the total transaction value');
  expect(jewellery).toContain('Qualifying jewellery job-work charges are generally taxed at 5%');
  const canada=text(outputFor('/us/canada-gst-hst-invoice-generator'));
  expect(canada).toContain('Nova Scotia is 14% from April 1, 2025');
 });
 it('renders all eight UPI handles and client-side image inputs',()=>{
  for(const route of routes){const html=text(outputFor(`/${route.slug}`));expect(html).toContain('data-key="logoFile"');expect(html).toContain('data-key="signatureFile"');}
  const upi=text(outputFor('/upi-qr-code-generator'));
  for(const handle of ['@okaxis','@okicici','@okhdfcbank','@oksbi','@ybl','@paytm','@ibl','@upi'])expect(upi).toContain(`data-handle="${handle}"`);
  expect(text(join(dist,'index.html')).indexOf('quick-switch')).toBeLessThan(text(join(dist,'index.html')).indexOf('home-hero'));
  expect(text(outputFor('/upi-qr-code-generator'))).toContain('rel="icon"');
  expect(existsSync(join(dist,'favicon.png'))).toBe(true);
  const directory=text(outputFor('/all-tools'));
  for(const route of routes)expect(directory,route.slug).toContain(`href="/${route.slug}"`);
 });
 it('renders unique DOM fields for jewellery, pharmacy, transport, and formal HR letter archetypes',()=>{
  const cases:[string,string[]][]=[
   ['jewellery-gst-invoice-generator',['metalPurity','grossWeight','netWeight','ratePerGram','makingCharges']],
   ['medical-pharmacy-bill-generator',['medicineName','batchNumber','expiryDate','doctorName','drugLicense']],
   ['transport-bilty-lr-generator',['truckNo','ewayBillNo','fromCity','toCity','freightStatus','copySet']],
   ['experience-certificate-format-generator',['employeeName','designation','joinDate','lastWorkingDate','letterBody']],
   ['relieving-letter-generator',['employeeName','designation','joinDate','lastWorkingDate','letterBody']],
   ['no-objection-certificate-noc-generator',['employeeName','designation','joinDate','lastWorkingDate','letterBody']]
  ];
  for(const [slug,keys] of cases){const html=text(outputFor(`/${slug}`));for(const key of keys)expect(html,`${slug} ${key}`).toContain(`data-key="${key}"`);}
 });
 it('uses the local currency on UK, Canada, Australia, and EU invoice routes',()=>{
  const cases:[string,string][]=[
   ['us/uk-vat-invoice-generator','GBP'],
   ['us/canada-gst-hst-invoice-generator','CAD'],
   ['us/australia-tax-invoice-abn-generator','AUD'],
   ['us/eu-reverse-charge-b2b-invoice','EUR']
  ];
  for(const [slug,currency] of cases){const html=text(outputFor(`/${slug}`));expect(html,slug).toContain(`data-currency="${currency}"`);expect(html,slug).toContain(`Unit price (${currency})`);expect(html,slug).toContain('data-key="sellerTaxId"');expect(html,slug).toContain('data-key="buyerTaxId"');expect(html,slug).toContain('data-key="items"');}
 });
 it('keeps the QR canvas bounded by its preview card and applies responsive workbench ordering',()=>{
  const styles=readdirSync(join(dist,'_astro')).filter(name=>name.endsWith('.css')).map(name=>text(join(dist,'_astro',name))).join('\n');
  expect(styles).toMatch(/\.standee canvas\{[^}]*max-width\s*:\s*100%/);
  expect(styles).toMatch(/\.standee\{[^}]*overflow\s*:\s*hidden/);
  expect(styles).toMatch(/\.tool-hero\{[^}]*min-height\s*:\s*0/);
  expect(styles).toContain('.tool-hero{min-height:0;padding:16px 32px 14px}');
  expect(styles).toContain('.workbench{margin-top:18px}');
 });
});
