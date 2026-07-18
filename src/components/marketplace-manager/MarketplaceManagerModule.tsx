import { useState } from "react";
import { MarketplaceTopBar, type SectionId } from "./TopBar";
import { DashboardSection } from "./sections/DashboardSection";
import {
  HeroBannerSection, CategoriesSection, WallsSection, PlacementSection, CardsSection,
  ActionsSection, OffersSection, PopupsSection, PartnersSection, TrustSection,
  ReviewsSection, FaqSection, ContactSection, SearchSection, AiSection, SeoSection,
  StickySection, AnalyticsSection, SettingsSection, StorefrontTopBarSection, FooterSection,
  FiltersSection, UpcomingSection, NotificationsSection, LayoutOrderSection, DeploymentSection,
  IntegritySection, MicroFeaturesSection, ToolkitSection, TopBarManagerSection, HomepageRowsSection,
  CardManagerSection, ProductsSection, ProductContentSection, ProductMediaSection, DemoSection,
  BlogSection, PricingSection, LicenseSection, DownloadsSection, CustomersSection, OrdersSection,
  PaymentsSection, ReleasesSection, AuthorsSection, VendorsSection, ResellersSection, AffiliateSection,
  InfluencerSection, QrSection, SupportSection, MediaLibrarySection, AiProvidersSection, ApiSection,
  ReportsSection, MarketingSection, AutomationSection, SecuritySection, SystemSection,
  IntegrationsSection, ExtraSection, AuthorApprovalSection, ModerationSection, DemoDomainSection,
  DemoSandboxSection, ProductUrlSection, FaviconProtectionSection, SeoAutomationSection, LeadsSection,
  AiContentSection, SecurityScanSection, QualityCheckSection, ProductAnalyticsSection, AuditLogSection,
} from "./sections";

export function MarketplaceManagerModule() {
  const [section, setSection] = useState<SectionId>("dashboard");
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketplaceTopBar active={section} onChange={setSection} />
      <main>{renderSection(section)}</main>
    </div>
  );
}

function renderSection(id: SectionId) {
  switch (id) {
    case "dashboard": return <DashboardSection />;
    case "topbar-manager": return <TopBarManagerSection />;
    case "homepage-rows": return <HomepageRowsSection />;
    case "card-manager": return <CardManagerSection />;
    case "toolkit": return <ToolkitSection />;
    case "storefront-topbar": return <StorefrontTopBarSection />;
    case "hero": return <HeroBannerSection />;
    case "categories": return <CategoriesSection />;
    case "walls": return <WallsSection />;
    case "layout-order": return <LayoutOrderSection />;
    case "placement": return <PlacementSection />;
    case "cards": return <CardsSection />;
    case "actions": return <ActionsSection />;
    case "filters": return <FiltersSection />;
    case "offers": return <OffersSection />;
    case "popups": return <PopupsSection />;
    case "upcoming": return <UpcomingSection />;
    case "partners": return <PartnersSection />;
    case "trust": return <TrustSection />;
    case "reviews": return <ReviewsSection />;
    case "faq": return <FaqSection />;
    case "contact": return <ContactSection />;
    case "footer": return <FooterSection />;
    case "search": return <SearchSection />;
    case "ai": return <AiSection />;
    case "seo": return <SeoSection />;
    case "sticky": return <StickySection />;
    case "notifications": return <NotificationsSection />;
    case "analytics": return <AnalyticsSection />;
    case "deployment": return <DeploymentSection />;
    case "micro": return <MicroFeaturesSection />;
    case "integrity": return <IntegritySection />;
    case "products": return <ProductsSection />;
    case "product-content": return <ProductContentSection />;
    case "product-media": return <ProductMediaSection />;
    case "demo": return <DemoSection />;
    case "blog": return <BlogSection />;
    case "pricing": return <PricingSection />;
    case "license": return <LicenseSection />;
    case "downloads": return <DownloadsSection />;
    case "customers": return <CustomersSection />;
    case "orders": return <OrdersSection />;
    case "payments": return <PaymentsSection />;
    case "releases": return <ReleasesSection />;
    case "authors": return <AuthorsSection />;
    case "vendors": return <VendorsSection />;
    case "resellers": return <ResellersSection />;
    case "affiliate": return <AffiliateSection />;
    case "influencer": return <InfluencerSection />;
    case "qr": return <QrSection />;
    case "support": return <SupportSection />;
    case "media": return <MediaLibrarySection />;
    case "ai-providers": return <AiProvidersSection />;
    case "api": return <ApiSection />;
    case "reports": return <ReportsSection />;
    case "marketing": return <MarketingSection />;
    case "automation": return <AutomationSection />;
    case "security": return <SecuritySection />;
    case "system": return <SystemSection />;
    case "integrations": return <IntegrationsSection />;
    case "extra": return <ExtraSection />;
    case "approval": return <AuthorApprovalSection />;
    case "moderation": return <ModerationSection />;
    case "quality": return <QualityCheckSection />;
    case "security-scan": return <SecurityScanSection />;
    case "favicon": return <FaviconProtectionSection />;
    case "demo-domain": return <DemoDomainSection />;
    case "demo-sandbox": return <DemoSandboxSection />;
    case "product-url": return <ProductUrlSection />;
    case "seo-auto": return <SeoAutomationSection />;
    case "ai-content": return <AiContentSection />;
    case "leads": return <LeadsSection />;
    case "product-analytics": return <ProductAnalyticsSection />;
    case "audit": return <AuditLogSection />;
    case "settings": return <SettingsSection />;
  }
}
