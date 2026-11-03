import {describe,it,expect} from 'vitest';
import {readFileSync,readdirSync,existsSync} from 'node:fs';
import {join,relative,sep} from 'node:path';
import {routes} from '../data/routes';
const dist=join(process.cwd(),'dist');
function htmlFiles(dir:string):string[]{return readdirSync(dir,{withFileTypes:true}).flatMap(entry=>{const path=join(dir,entry.name);return entry.isDirectory()?htmlFiles(path):entry.name.endsWith('.html')?[path]:[];});}
const files=existsSync(dist)?htmlFiles(dist):[];
const text=(file:string)=>readFileSync(file,'utf8');
const attr=(html:string,pattern:RegExp)=>html.match(pattern)?.[1]||'';
function outputFor(pathname:string){const clean=decodeURIComponent(pathname.split(/[?#]/)[0]).replace(/^\/+|\/+$/g,'');return clean?join(dist,clean,'index.html'):join(dist,'index.html');}
describe('built SEO and privacy surface',()=>{
 it('contains Cloudflare and sitemap artifacts at the canonical host',()=>{for(const name of ['sitemap-index.xml','sitemap-0.xml','robots.txt','_headers','_redirects'])expect(existsSync(join(dist,name)),`${name} should be in dist`).toBe(true);const sitemap=text(join(dist,'sitemap-0.xml'));expect(sitemap).toContain('https://billqrnow.pages.dev/');expect(text(join(dist,'robots.txt'))).toContain('https://billqrnow.pages.dev/sitemap-index.xml');});
 it('builds at least 66 pages and keeps every route slug dot-free',()=>{expect(files.length).toBeGreaterThanOrEqual(66);expect(routes).toHaveLength(60);for(const route of routes)expect(route.slug).not.toContain('.');});
 it('uses unique titles, descriptions, canonicals, and exactly one H1 on every page',()=>{const titles:string[]=[],descriptions:string[]=[];for(const file of files){const html=text(file);titles.push(attr(html,/<title>(.*?)<\/title>/i));descriptions.push(attr(html,/<meta\s+name="description"\s+content="([^"]*)"/i));const canon=attr(html,/<link\s+rel="canonical"\s+href="([^"]*)"/i);expect(canon).toMatch(/^https:\/\/billqrnow\.pages\.dev\//);expect((html.match(/<h1(?:\s[^>]*)?>/gi)||[]).length,relative(dist,file)).toBe(1);}expect(titles.every(Boolean)).toBe(true);expect(descriptions.every(Boolean)).toBe(true);expect(new Set(titles).size).toBe(files.length);expect(new Set(descriptions).size).toBe(files.length);});
 it('has no broken root-relative internal links across built pages',()=>{const broken:string[]=[];for(const file of files){const html=text(file);for(const match of html.matchAll(/<a\b[^>]*\bhref="(\/[^"#]*)"/gi)){const href=match[1];if(!existsSync(outputFor(href)))broken.push(`${relative(dist,file)} -> ${href}`);}}expect(broken).toEqual([]);});
 it('does not render forms that post financial data to a remote server',()=>{for(const file of files){const html=text(file);for(const match of html.matchAll(/<form\b([^>]*)>/gi)){const attrs=match[1];expect(attrs).not.toMatch(/method=["']?post/i);expect(attrs).not.toMatch(/action=["']https?:\/\//i);}}});
});
