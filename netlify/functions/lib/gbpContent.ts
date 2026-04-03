export type BusinessType =
  | 'local_service'
  | 'consultant'
  | 'nonprofit'
  | 'church'
  | 'hoa'
  | 'retail'
  | 'creative'
  | 'technology'

export interface GBPTypeContent {
  categories: {
    primary: string
    secondary: string[]
    rationale: string
  }
  services: Array<{
    name: string
    descriptionTemplate: string
  }>
  qAndA: Array<{
    question: string
    answer: string
  }>
  photoChecklist: Array<{
    item: string
    why: string
    priority: 'high' | 'medium' | 'low'
  }>
  postTemplates: {
    intro: { body: string; cta: string }
    event: { body: string; cta: string }
    impact: { body: string; cta: string }
  }
  reviewTemplates: {
    positive: string
    mixed: string
  }
  descriptionTemplate: string
}

export const GBP_CONTENT: Record<BusinessType, GBPTypeContent> = {
  // ──────────────────────────────────────────────────
  // NONPROFIT — full curated content
  // ──────────────────────────────────────────────────
  nonprofit: {
    descriptionTemplate:
      '{{businessName}} is a nonprofit organization proudly serving {{cityRegion}} and the surrounding communities. {{businessDescription}} Our programs are designed to create lasting change by addressing real needs and empowering the people we serve. We partner with local organizations, volunteers, and donors to maximize our reach and impact. Whether you are looking to get involved, access our services, or support our mission through a contribution, we welcome you. Visit us to learn how {{businessName}} is making a difference in {{cityRegion}} every day.',

    categories: {
      primary: 'Non-profit organization',
      secondary: [
        'Charity',
        'Social services organization',
        'Community center',
        'Food bank',
        'Counseling center',
        'Volunteer organization',
        'Youth organization',
        'Educational institution',
      ],
      rationale:
        'Non-profit organization is the correct primary category for IRS 501(c)(3) organizations. Secondary categories should reflect your actual programs — remove any that do not apply to your specific work.',
    },

    services: [
      {
        name: 'Community Programs',
        descriptionTemplate:
          '{{businessName}} offers community programs in {{cityRegion}} that address local needs through hands-on services and direct support.',
      },
      {
        name: 'Volunteer Opportunities',
        descriptionTemplate:
          'Join {{businessName}} as a volunteer and make a tangible difference in {{cityRegion}}. We offer flexible opportunities for individuals and groups.',
      },
      {
        name: 'Donor Giving',
        descriptionTemplate:
          'Support the mission of {{businessName}} through one-time or recurring donations. Every contribution directly funds programs in {{cityRegion}}.',
      },
      {
        name: 'Case Management',
        descriptionTemplate:
          'Our case management team works one-on-one with clients in {{cityRegion}} to develop personalized plans and connect them with the right resources.',
      },
      {
        name: 'Educational Workshops',
        descriptionTemplate:
          '{{businessName}} hosts educational workshops covering life skills, financial literacy, and personal development for residents of {{cityRegion}}.',
      },
      {
        name: 'Resource Referrals',
        descriptionTemplate:
          'We connect individuals and families in {{cityRegion}} with partner organizations and community resources that can help meet their specific needs.',
      },
      {
        name: 'Community Events',
        descriptionTemplate:
          '{{businessName}} organizes community events throughout the year in {{cityRegion}} that bring people together, raise awareness, and celebrate progress.',
      },
      {
        name: 'Advocacy Services',
        descriptionTemplate:
          'Our advocacy team at {{businessName}} works to amplify the voices of underserved communities in {{cityRegion}} and drive meaningful policy change.',
      },
    ],

    qAndA: [
      {
        question: 'How can I get involved with {{businessName}}?',
        answer:
          'There are many ways to get involved! You can volunteer your time, attend one of our events, or make a financial contribution. Visit our website or call us to learn about current opportunities in {{cityRegion}}.',
      },
      {
        question: 'How do I donate to {{businessName}}?',
        answer:
          'You can donate online through our website, by mail, or in person at our {{cityRegion}} location. We accept one-time and recurring gifts. All donations are tax-deductible.',
      },
      {
        question: 'Does {{businessName}} offer financial assistance?',
        answer:
          'We offer several assistance programs depending on eligibility and current funding. Contact us directly to discuss your situation and learn what resources may be available to you in {{cityRegion}}.',
      },
      {
        question: 'Who does {{businessName}} serve?',
        answer:
          'We serve individuals, families, and communities throughout {{cityRegion}}. Our programs are designed to support people facing a variety of challenges, and we welcome everyone regardless of background.',
      },
      {
        question: 'Are your services free?',
        answer:
          'Most of our services are provided at no cost to participants. Some specialized programs may have a nominal fee, but we never turn anyone away due to inability to pay.',
      },
      {
        question: 'How do I volunteer at {{businessName}}?',
        answer:
          'We welcome volunteers of all skill levels and availability. You can sign up through our website or contact us directly. We will match you with an opportunity that fits your interests and schedule.',
      },
      {
        question: 'Where is {{businessName}} located?',
        answer:
          'We are located in {{cityRegion}}. Visit our Google Business Profile for directions, hours, and contact information. We look forward to seeing you!',
      },
      {
        question: 'What are your hours of operation?',
        answer:
          'Our regular office hours are listed on our Google Business Profile. Some programs and events run outside of standard hours — check our website or call for specific program schedules.',
      },
      {
        question: 'How is my donation used?',
        answer:
          'Your donation directly funds our programs and services in {{cityRegion}}. We are committed to transparency and publish annual reports detailing how funds are allocated.',
      },
      {
        question: 'Does {{businessName}} partner with other organizations?',
        answer:
          'Yes, we actively partner with local businesses, government agencies, and other nonprofits in {{cityRegion}} to expand our reach and deliver comprehensive support.',
      },
      {
        question: 'How do I contact {{businessName}}?',
        answer:
          'You can reach us by phone, email, or by visiting our office in {{cityRegion}}. Our contact information is listed on our Google Business Profile and website.',
      },
      {
        question: 'Is {{businessName}} a 501(c)(3) organization?',
        answer:
          'Yes, {{businessName}} is a registered 501(c)(3) nonprofit organization. All donations are tax-deductible to the extent allowed by law.',
      },
    ],

    photoChecklist: [
      { item: 'Exterior front of building with signage', why: 'Helps people recognize your location when they visit. This is the most important photo for local search.', priority: 'high' },
      { item: 'Program or service in action (with permission)', why: 'Shows the real impact of your work and helps potential donors and volunteers visualize what you do.', priority: 'high' },
      { item: 'Staff or leadership team photo', why: 'Builds trust and puts faces to your organization. People connect with people, not logos.', priority: 'high' },
      { item: 'Interior of main space or office', why: 'Gives visitors a sense of what to expect when they walk through the door.', priority: 'medium' },
      { item: 'Event or community gathering', why: 'Demonstrates community engagement and shows that your organization is active and thriving.', priority: 'medium' },
      { item: 'Client impact moment (with permission)', why: 'Tells a visual story of transformation that resonates with donors and supporters.', priority: 'medium' },
      { item: 'Donation drop-off or collection area', why: 'Makes it easy for donors to know where and how to contribute physical goods.', priority: 'low' },
      { item: 'Logo on materials, signage, or vehicle', why: 'Reinforces brand recognition and professionalism across all your touchpoints.', priority: 'low' },
      { item: 'Volunteer day group photo', why: 'Attracts future volunteers by showing a welcoming, community-driven environment.', priority: 'low' },
      { item: 'Google cover photo — 16:9 exterior or wide shot', why: 'This is the banner image on your GBP. A wide, well-lit exterior shot works best at this aspect ratio.', priority: 'low' },
    ],

    postTemplates: {
      intro: {
        body: '{{businessName}} is a nonprofit organization serving {{cityRegion}} with programs designed to strengthen our community from the ground up. Whether you are looking for support, want to volunteer your time, or are searching for a meaningful way to give back, we have a place for you. Our team is passionate about creating real, lasting change — and it starts with people like you getting involved. Stop by, give us a call, or visit our website to learn more about what we do and how you can be part of the mission.',
        cta: 'Learn more about our mission and how to get involved at our website.',
      },
      event: {
        body: '{{businessName}} is hosting an upcoming event in {{cityRegion}} and we would love to see you there! This is a great opportunity to connect with your neighbors, learn about the work we do, and find out how you can support our mission. Whether you are a long-time supporter or hearing about us for the first time, all are welcome. Keep an eye on our page for event details, dates, and how to RSVP.',
        cta: 'Follow our page for event updates and details on how to attend.',
      },
      impact: {
        body: 'Because of the generosity of our donors and the dedication of our volunteers, {{businessName}} continues to make a measurable impact in {{cityRegion}}. This year alone, we have expanded our reach, served more families, and launched new programs to meet growing community needs. None of this would be possible without the support of people who believe in our mission. Thank you for being part of the story.',
        cta: 'See the difference your support makes — visit our website for our latest impact report.',
      },
    },

    reviewTemplates: {
      positive:
        'Thank you so much for your kind words and for taking the time to share your experience with {{businessName}}! It means the world to our team to know that our work in {{cityRegion}} is making a difference. We are grateful for supporters like you who help us keep our mission moving forward.',
      mixed:
        'Thank you for sharing your feedback with {{businessName}}. We take every comment seriously and want to make sure your experience reflects the care and commitment we bring to our work in {{cityRegion}}. Please reach out to us directly so we can address your concerns and make things right.',
    },
  },

  // ──────────────────────────────────────────────────
  // CHURCH — full curated content
  // ──────────────────────────────────────────────────
  church: {
    descriptionTemplate:
      '{{businessName}} is a welcoming church located in {{cityRegion}}, open to everyone seeking faith, community, and purpose. {{businessDescription}} We gather each week for worship, fellowship, and teaching that speaks to real life. Our ministries serve all ages — from children and youth to adults and seniors — and our doors are open for community events, counseling, and celebration. Whether you are looking for a church home, exploring your faith, or need a caring community to walk alongside you, {{businessName}} invites you to join us in {{cityRegion}}.',

    categories: {
      primary: 'Church',
      secondary: [
        'Religious organization',
        'Christian church',
        'Place of worship',
        'Community center',
        'Non-profit organization',
        'Wedding venue',
        'Event venue',
      ],
      rationale:
        'Church is the most direct primary category for houses of worship. Secondary categories help surface your profile for people searching for worship services, community events, or venue rentals. Adjust denomination-specific terms to match your tradition.',
    },

    services: [
      {
        name: 'Sunday Worship',
        descriptionTemplate:
          'Join {{businessName}} for Sunday worship services in {{cityRegion}}. We offer a welcoming environment with music, teaching, and fellowship for all ages.',
      },
      {
        name: 'Small Groups / Bible Study',
        descriptionTemplate:
          'Connect with others at {{businessName}} through small groups and Bible study opportunities. Groups meet throughout the week across {{cityRegion}}.',
      },
      {
        name: "Children's Ministry",
        descriptionTemplate:
          "{{businessName}} provides a safe, fun, and faith-filled environment for children during services and throughout the week in {{cityRegion}}.",
      },
      {
        name: 'Youth Group',
        descriptionTemplate:
          'Our youth ministry at {{businessName}} gives teens in {{cityRegion}} a place to grow in faith, build friendships, and develop leadership skills.',
      },
      {
        name: 'Pastoral Counseling',
        descriptionTemplate:
          'The pastoral team at {{businessName}} offers confidential counseling and support for individuals and families in {{cityRegion}} facing life challenges.',
      },
      {
        name: 'Community Outreach',
        descriptionTemplate:
          '{{businessName}} serves {{cityRegion}} through outreach programs including food drives, neighborhood service projects, and partnership with local organizations.',
      },
      {
        name: 'Weddings & Ceremonies',
        descriptionTemplate:
          '{{businessName}} hosts weddings, baptisms, and other ceremonies in our {{cityRegion}} facility. Contact us to learn about availability and pastoral services.',
      },
      {
        name: 'Facility Rental',
        descriptionTemplate:
          'Our facilities in {{cityRegion}} are available for community events, meetings, and gatherings. Contact {{businessName}} for availability and rental details.',
      },
    ],

    qAndA: [
      {
        question: 'What time are services at {{businessName}}?',
        answer:
          'Our service times are listed on our Google Business Profile and website. We typically offer multiple service options on Sundays. Check our page for the most up-to-date schedule.',
      },
      {
        question: 'Is everyone welcome at {{businessName}}?',
        answer:
          'Absolutely! {{businessName}} welcomes everyone regardless of background, age, or where you are in your faith journey. Come as you are — we are glad you are here.',
      },
      {
        question: 'Does {{businessName}} have programs for children?',
        answer:
          'Yes! We offer age-appropriate programs for children during our services and throughout the week. Our team is trained, background-checked, and passionate about helping kids grow.',
      },
      {
        question: 'What denomination is {{businessName}}?',
        answer:
          'For details about our denomination, beliefs, and theological tradition, please visit our website or reach out to our pastoral team. We are happy to answer any questions.',
      },
      {
        question: 'Is there parking available at {{businessName}}?',
        answer:
          'Yes, we have on-site parking available for our congregation and visitors. For large events, additional parking information will be shared in advance.',
      },
      {
        question: 'How do I contact the pastor at {{businessName}}?',
        answer:
          'You can reach our pastoral team through our website, by calling our office, or by visiting us in person in {{cityRegion}}. We would love to hear from you.',
      },
      {
        question: 'Does {{businessName}} offer counseling services?',
        answer:
          'Yes, our pastoral team provides confidential counseling for individuals, couples, and families. Contact us to schedule a conversation.',
      },
      {
        question: 'Can I get married at {{businessName}}?',
        answer:
          'Yes! {{businessName}} hosts weddings and can provide pastoral officiation. Contact our office in {{cityRegion}} to discuss availability, requirements, and planning.',
      },
      {
        question: 'Does {{businessName}} stream services online?',
        answer:
          'Many of our services are available online. Check our website or social media pages for livestream links and recorded services.',
      },
      {
        question: 'How do I get involved at {{businessName}}?',
        answer:
          'We would love to have you! You can join a small group, volunteer on a ministry team, or attend one of our events. Talk to our welcome team on Sunday or contact us online.',
      },
      {
        question: 'Is {{businessName}} wheelchair accessible?',
        answer:
          'Yes, our facility in {{cityRegion}} is wheelchair accessible. If you have specific accessibility needs, please contact us so we can make sure you are comfortable.',
      },
      {
        question: 'Does {{businessName}} have a food pantry or assistance program?',
        answer:
          'We offer community assistance programs that may include food distribution, financial counseling, and resource referrals. Contact us to learn what is currently available.',
      },
    ],

    photoChecklist: [
      { item: 'Exterior with signage (multiple times of day)', why: 'Helps visitors find you and shows your building in welcoming light. Daytime and evening shots both perform well.', priority: 'high' },
      { item: 'Sanctuary or worship space', why: 'The first thing new visitors want to see. A clean, inviting worship space photo builds confidence to attend.', priority: 'high' },
      { item: 'Congregation during a service (with permission)', why: 'Shows your church is alive and active. People want to see real community before they walk through the door.', priority: 'high' },
      { item: 'Pastoral or leadership headshot', why: 'Puts a face to the church and builds personal trust before someone ever visits.', priority: 'medium' },
      { item: "Children's or youth ministry space", why: 'Parents search for churches with strong kids programs. Show them the environment their children will be in.', priority: 'medium' },
      { item: 'Welcome area or lobby', why: 'Gives first-time visitors a preview of the arrival experience and sets expectations.', priority: 'medium' },
      { item: 'Small group or fellowship setting', why: 'Highlights the relational side of your church beyond Sunday morning worship.', priority: 'low' },
      { item: 'Outdoor spaces or parking area', why: 'Reduces anxiety for first-time visitors who wonder about parking and the surrounding area.', priority: 'low' },
      { item: 'Community event or outreach activity', why: 'Shows your church is engaged with the broader community, not just inward-focused.', priority: 'low' },
      { item: 'Cover photo — 16:9 exterior or sanctuary wide shot', why: 'This is the banner on your GBP. A wide, well-lit shot of the exterior or sanctuary works best.', priority: 'low' },
    ],

    postTemplates: {
      intro: {
        body: 'Welcome to {{businessName}} in {{cityRegion}}! We are a church family that believes everyone has a place at the table. Whether you have been following Jesus for decades or are just starting to ask questions, you are welcome here. Our Sunday services are designed to be relevant, encouraging, and rooted in Scripture. We also offer small groups, youth and children\'s programs, and community outreach throughout the week. Come see what God is doing at {{businessName}} — we would love to meet you.',
        cta: 'Visit our website for service times, directions, and ways to get connected.',
      },
      event: {
        body: '{{businessName}} is excited to invite {{cityRegion}} to an upcoming event! Whether it is a special service, community outreach, or a seasonal celebration, we love bringing people together for something meaningful. Our events are open to everyone — members, visitors, and neighbors alike. Watch this space for details on date, time, and how to get involved.',
        cta: 'Follow our page for event details, dates, and registration info.',
      },
      impact: {
        body: 'At {{businessName}}, we believe the church exists to serve — not just on Sundays, but every day of the week. Through outreach programs, volunteer teams, and community partnerships in {{cityRegion}}, we are seeing lives changed and neighborhoods strengthened. From food drives to mentoring, counseling to celebration, our congregation is committed to showing up for the people around us. Thank you to everyone who gives, serves, and prays alongside us.',
        cta: 'Learn how you can be part of the impact at our website.',
      },
    },

    reviewTemplates: {
      positive:
        'Thank you so much for your kind words about {{businessName}}! We are blessed to have you as part of our church family in {{cityRegion}}. It is encouraging to hear that your experience has been meaningful, and we look forward to continuing to grow together in faith and community.',
      mixed:
        'Thank you for sharing your experience with {{businessName}}. Your feedback matters to us, and we want every person who walks through our doors in {{cityRegion}} to feel welcome and cared for. Please reach out to our pastoral team directly so we can hear more and address your concerns personally.',
    },
  },

  // ──────────────────────────────────────────────────
  // LOCAL SERVICE — plumber, electrician, cleaning, etc.
  // ──────────────────────────────────────────────────
  local_service: {
    descriptionTemplate:
      '{{businessName}} provides reliable, professional services to homeowners and businesses throughout {{cityRegion}}. {{businessDescription}} Our licensed and experienced team is committed to quality workmanship, transparent pricing, and timely service on every job. We understand that when you need help, you need someone you can trust to show up and get the job done right. From routine maintenance to emergency calls, {{businessName}} is the local team {{cityRegion}} counts on.',

    categories: {
      primary: 'Home service contractor',
      secondary: [
        'Handyman',
        'Plumber',
        'Electrician',
        'Cleaning service',
        'HVAC contractor',
        'Painter',
        'Lawn care service',
        'Contractor',
      ],
      rationale:
        'Home service contractor is a broad primary that works for most trades. Swap to your specific trade (Plumber, Electrician, etc.) if Google allows it as a primary. Keep secondary categories that match your actual service offerings.',
    },

    services: [
      {
        name: 'Residential Services',
        descriptionTemplate:
          '{{businessName}} delivers dependable residential services across {{cityRegion}}, from repairs and installations to preventive maintenance.',
      },
      {
        name: 'Commercial Services',
        descriptionTemplate:
          'We work with businesses in {{cityRegion}} to handle maintenance, build-outs, and ongoing service contracts with minimal disruption.',
      },
      {
        name: 'Emergency Service',
        descriptionTemplate:
          'When something goes wrong, {{businessName}} offers fast emergency response for customers in {{cityRegion}} to get the problem under control.',
      },
      {
        name: 'Preventive Maintenance',
        descriptionTemplate:
          'Avoid costly repairs with scheduled maintenance plans from {{businessName}}. We help {{cityRegion}} homeowners stay ahead of problems.',
      },
      {
        name: 'Inspections & Estimates',
        descriptionTemplate:
          '{{businessName}} provides honest inspections and transparent estimates so you know exactly what to expect before any work begins.',
      },
      {
        name: 'Installation & Upgrades',
        descriptionTemplate:
          'From new installations to system upgrades, {{businessName}} delivers professional results for homes and businesses in {{cityRegion}}.',
      },
      {
        name: 'Seasonal Services',
        descriptionTemplate:
          'Keep your property in top shape year-round with seasonal service packages from {{businessName}}, tailored for {{cityRegion}} conditions.',
      },
      {
        name: 'Consultation',
        descriptionTemplate:
          'Not sure what you need? {{businessName}} offers consultations to help {{cityRegion}} property owners make informed decisions about their home or business.',
      },
    ],

    qAndA: [
      {
        question: 'What areas does {{businessName}} serve?',
        answer: '{{businessName}} serves {{cityRegion}} and surrounding areas. Contact us to confirm we cover your location.',
      },
      {
        question: 'Do you offer free estimates?',
        answer: 'Yes, {{businessName}} provides free estimates for most services. Call or message us to schedule yours.',
      },
      {
        question: 'Are you licensed and insured?',
        answer: '{{businessName}} is fully licensed and insured to operate in {{cityRegion}}. We carry all required certifications for our trade.',
      },
      {
        question: 'Do you offer emergency services?',
        answer: 'Yes, we offer emergency response for urgent situations. Call us anytime — our {{cityRegion}} team is ready to help.',
      },
      {
        question: 'How do I schedule a service?',
        answer: 'You can book with {{businessName}} by phone, through our website, or by messaging us on Google. We will find a time that works for you.',
      },
      {
        question: 'What are your hours?',
        answer: 'Our regular hours are listed on our Google Business Profile. We also offer emergency availability outside normal hours.',
      },
      {
        question: 'Do you guarantee your work?',
        answer: '{{businessName}} stands behind every job with a satisfaction guarantee. If something is not right, we will come back and make it right.',
      },
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept cash, check, and major credit cards. Payment details are confirmed before any work begins.',
      },
      {
        question: 'Can I see reviews from other customers?',
        answer: 'Absolutely! Check our Google reviews to see what {{cityRegion}} customers are saying about their experience with {{businessName}}.',
      },
      {
        question: 'Do you offer maintenance plans?',
        answer: 'Yes, we offer scheduled maintenance plans to help {{cityRegion}} homeowners prevent costly repairs and keep systems running smoothly.',
      },
      {
        question: 'How long have you been in business?',
        answer: '{{businessName}} has proudly served {{cityRegion}} for years. Our experience means you get quality work from a team that knows the area.',
      },
      {
        question: 'Do you work on weekends?',
        answer: 'We offer weekend availability for many services. Contact {{businessName}} to check weekend scheduling in {{cityRegion}}.',
      },
    ],

    photoChecklist: [
      { item: 'Company vehicle or van with branding', why: 'A branded vehicle is one of the most-viewed photos on service business profiles. It builds instant credibility.', priority: 'high' },
      { item: 'Team photo in uniform or work gear', why: 'Shows professionalism and puts faces to your brand. Customers trust businesses where they can see the people.', priority: 'high' },
      { item: 'Before and after project photos', why: 'The most compelling proof of your work quality. Use real projects in your service area.', priority: 'high' },
      { item: 'Technician actively working on a job', why: 'Action shots demonstrate expertise and give customers confidence in your skills.', priority: 'medium' },
      { item: 'Equipment and tools of the trade', why: 'Professional equipment signals competence and investment in quality.', priority: 'medium' },
      { item: 'Office or shop exterior', why: 'Having a physical location adds legitimacy, especially for local service businesses.', priority: 'medium' },
      { item: 'Completed project showcase', why: 'Finished work photos let potential customers envision results for their own property.', priority: 'low' },
      { item: 'Customer interaction or walkthrough', why: 'Shows your consultation process and customer-first approach.', priority: 'low' },
      { item: 'Certifications, licenses, or awards', why: 'Builds trust through third-party validation of your qualifications.', priority: 'low' },
      { item: 'Cover photo — vehicle, team, or finished project (16:9)', why: 'Your GBP banner should showcase your best work or branded vehicle at the right aspect ratio.', priority: 'low' },
    ],

    postTemplates: {
      intro: {
        body: '{{businessName}} is your trusted local service provider in {{cityRegion}}. We take pride in showing up on time, doing quality work, and treating your property like our own. Whether you need a quick repair, a major project, or ongoing maintenance, our experienced team has you covered. We are fully licensed, insured, and committed to earning your trust on every job. Give us a call or visit our website to see how we can help.',
        cta: 'Call or message {{businessName}} today to schedule your free estimate.',
      },
      event: {
        body: '{{businessName}} is offering a seasonal special for {{cityRegion}} homeowners! Now is the perfect time to get ahead of maintenance before the weather changes. Whether it is a tune-up, inspection, or a project you have been putting off, we are here to help at a great value. Limited availability — book soon to lock in your spot.',
        cta: 'Contact us to claim your seasonal special before spots fill up.',
      },
      impact: {
        body: 'Another happy customer in {{cityRegion}}! {{businessName}} just wrapped up a project and the results speak for themselves. We love what we do, and it shows in the quality of every job — big or small. Thank you to our customers for trusting us with your home. Your referrals and reviews keep us going, and we are grateful for every one.',
        cta: 'See our latest reviews and book your next service at our website.',
      },
    },

    reviewTemplates: {
      positive:
        'Thank you for the great review! It is always rewarding to hear that our team delivered the quality and service {{cityRegion}} homeowners expect from {{businessName}}. We appreciate your trust and look forward to helping you again in the future.',
      mixed:
        'Thank you for your honest feedback. At {{businessName}}, we hold ourselves to a high standard, and we want to make sure every customer in {{cityRegion}} has a positive experience. Please reach out to us directly so we can discuss what happened and make it right.',
    },
  },

  // ──────────────────────────────────────────────────
  // CONSULTANT
  // ──────────────────────────────────────────────────
  consultant: {
    descriptionTemplate:
      '{{businessName}} is a consulting firm based in {{cityRegion}}, helping organizations achieve clarity, efficiency, and sustainable growth. {{businessDescription}} We partner with business owners and leadership teams to identify challenges, develop actionable strategies, and deliver measurable results. With a hands-on approach and deep industry experience, {{businessName}} serves as a trusted advisor to clients across {{cityRegion}} and beyond.',

    categories: {
      primary: 'Business consultant',
      secondary: [
        'Management consultant',
        'Financial consultant',
        'Marketing consultant',
        'Human resources consultant',
        'Business coach',
        'Corporate office',
        'Training center',
      ],
      rationale:
        'Business consultant is the broadest primary. If your niche is specific (marketing, HR, financial), consider using that as primary instead. Keep secondary categories aligned with the services you actively offer.',
    },

    services: [
      {
        name: 'Strategic Planning',
        descriptionTemplate:
          '{{businessName}} helps businesses in {{cityRegion}} develop clear, actionable strategic plans that align leadership and drive measurable growth.',
      },
      {
        name: 'Business Coaching',
        descriptionTemplate:
          'Our coaching programs at {{businessName}} provide one-on-one guidance for business owners and leaders in {{cityRegion}} who want to reach the next level.',
      },
      {
        name: 'Operational Assessment',
        descriptionTemplate:
          '{{businessName}} conducts thorough operational assessments to identify inefficiencies and recommend improvements for {{cityRegion}} businesses.',
      },
      {
        name: 'Financial Analysis',
        descriptionTemplate:
          'We help organizations in {{cityRegion}} understand their numbers and make data-driven financial decisions through detailed analysis and forecasting.',
      },
      {
        name: 'Marketing Strategy',
        descriptionTemplate:
          '{{businessName}} builds marketing strategies that help {{cityRegion}} businesses attract the right clients and grow sustainably.',
      },
      {
        name: 'Team Development',
        descriptionTemplate:
          'Strengthen your team with leadership development and team-building programs designed by {{businessName}} for organizations in {{cityRegion}}.',
      },
      {
        name: 'Process Optimization',
        descriptionTemplate:
          '{{businessName}} identifies bottlenecks and streamlines workflows to help {{cityRegion}} businesses operate more efficiently.',
      },
      {
        name: 'Growth Advisory',
        descriptionTemplate:
          'Ready to scale? {{businessName}} provides growth advisory services that guide {{cityRegion}} businesses through expansion, hiring, and new market entry.',
      },
    ],

    qAndA: [
      {
        question: 'What types of businesses does {{businessName}} work with?',
        answer: 'We work with small to mid-sized businesses across a range of industries in {{cityRegion}}. Contact us to discuss whether we are a good fit.',
      },
      {
        question: 'How does the consulting process work?',
        answer: '{{businessName}} starts with a discovery session to understand your goals and challenges. From there, we build a tailored plan and work alongside your team to implement it.',
      },
      {
        question: 'Do you offer free consultations?',
        answer: 'Yes, {{businessName}} offers an initial consultation at no charge. This helps both of us determine if our approach is the right fit for your needs.',
      },
      {
        question: 'How long does an engagement typically last?',
        answer: 'It depends on the scope. Some projects are completed in a few weeks, while strategic partnerships may span several months. We will outline a clear timeline upfront.',
      },
      {
        question: 'Can you work with remote teams?',
        answer: 'Absolutely. While {{businessName}} is based in {{cityRegion}}, we regularly work with remote and hybrid teams using video calls and collaborative tools.',
      },
      {
        question: 'What makes {{businessName}} different from other consultants?',
        answer: 'We focus on implementation, not just recommendations. Our team rolls up our sleeves and works with you to execute the plan and track results.',
      },
      {
        question: 'Do you offer ongoing retainer services?',
        answer: 'Yes, many of our clients in {{cityRegion}} choose a monthly retainer for continued strategic support and accountability.',
      },
      {
        question: 'How do I get started with {{businessName}}?',
        answer: 'Reach out through our website or Google Business Profile to schedule a free discovery call. We will go from there.',
      },
      {
        question: 'What results can I expect?',
        answer: 'Every engagement is different, but our clients typically see improvements in revenue, team performance, or operational efficiency within the first quarter.',
      },
      {
        question: 'Do you work with nonprofits?',
        answer: 'Yes, {{businessName}} has experience working with nonprofit organizations in {{cityRegion}} on strategic planning, fundraising, and operations.',
      },
      {
        question: 'Is my information kept confidential?',
        answer: 'Absolutely. {{businessName}} treats all client information with the highest level of confidentiality. We are happy to sign an NDA if needed.',
      },
      {
        question: 'Do you provide training for teams?',
        answer: 'Yes, we offer customized training workshops and seminars for teams in {{cityRegion}} on leadership, communication, and business strategy.',
      },
    ],

    photoChecklist: [
      { item: 'Professional headshot of lead consultant', why: 'Consulting is relationship-driven. A professional headshot builds immediate trust and personal connection.', priority: 'high' },
      { item: 'Team photo or leadership group', why: 'Shows the depth of expertise behind the firm, especially if you have multiple consultants.', priority: 'high' },
      { item: 'Office or meeting space', why: 'A professional workspace signals stability and credibility to potential clients.', priority: 'high' },
      { item: 'Working session or whiteboard strategy photo', why: 'Action shots of consulting work demonstrate your process and collaborative approach.', priority: 'medium' },
      { item: 'Speaking engagement or workshop', why: 'Positions you as a thought leader and authority in your field.', priority: 'medium' },
      { item: 'Client meeting or presentation', why: 'Shows your engagement style and how you interact with clients face-to-face.', priority: 'medium' },
      { item: 'Logo and branding materials', why: 'Reinforces brand recognition across search results and social platforms.', priority: 'low' },
      { item: 'Awards, certifications, or credentials', why: 'Third-party validation builds credibility, especially for prospective clients comparing options.', priority: 'low' },
      { item: 'Event or networking photo', why: 'Shows your presence in the business community and willingness to connect.', priority: 'low' },
      { item: 'Cover photo — professional team or office (16:9)', why: 'A polished wide shot for your GBP banner that represents your firm\'s professionalism.', priority: 'low' },
    ],

    postTemplates: {
      intro: {
        body: '{{businessName}} is a consulting firm in {{cityRegion}} that helps businesses cut through complexity and focus on what matters most — growth, efficiency, and results. Whether you are a startup finding your footing or an established business looking to scale, our team brings the strategy, accountability, and experience you need. We do not just give advice — we work alongside you to make it happen.',
        cta: 'Schedule a free discovery call at our website to see how we can help.',
      },
      event: {
        body: '{{businessName}} is hosting an upcoming workshop for business owners in {{cityRegion}}. If you have been looking for practical strategies to grow your business, improve your operations, or strengthen your team, this is for you. Space is limited, so register early. We look forward to seeing you there.',
        cta: 'Register for our upcoming workshop — details on our website.',
      },
      impact: {
        body: 'We love seeing our clients in {{cityRegion}} hit new milestones. {{businessName}} recently helped a local business streamline their operations and increase revenue within the first quarter of our engagement. Results like these are why we do what we do. If your business is ready for a breakthrough, let us talk.',
        cta: 'Ready for your breakthrough? Contact {{businessName}} to get started.',
      },
    },

    reviewTemplates: {
      positive:
        'Thank you for the thoughtful review! At {{businessName}}, we invest deeply in every client relationship, and it is gratifying to know our work in {{cityRegion}} is delivering real value. We look forward to continuing to support your growth.',
      mixed:
        'We appreciate you taking the time to share your experience with {{businessName}}. Your feedback helps us improve, and we want to make sure we met your expectations. Please contact us directly so we can discuss this further.',
    },
  },

  // ──────────────────────────────────────────────────
  // HOA — homeowners association, community management
  // ──────────────────────────────────────────────────
  hoa: {
    descriptionTemplate:
      '{{businessName}} is the homeowners association serving the residents of {{cityRegion}}. {{businessDescription}} We are committed to maintaining property values, fostering a strong sense of community, and ensuring our shared spaces are well-kept and welcoming for all residents. Our board and management team handle everything from community maintenance and rule enforcement to event planning and resident communications. Learn more about living in our community and how {{businessName}} works to make {{cityRegion}} a great place to call home.',

    categories: {
      primary: 'Homeowners association',
      secondary: [
        'Community association',
        'Property management company',
        'Community center',
        'Swimming pool',
        'Park',
        'Playground',
      ],
      rationale:
        'Homeowners association is the most accurate primary. Add secondary categories only for amenities your community actually offers (pool, park, playground, etc.).',
    },

    services: [
      {
        name: 'Community Maintenance',
        descriptionTemplate:
          '{{businessName}} coordinates landscaping, common area upkeep, and infrastructure maintenance across the {{cityRegion}} community.',
      },
      {
        name: 'Resident Communications',
        descriptionTemplate:
          'Stay informed with regular updates from {{businessName}} about community news, meetings, and events in {{cityRegion}}.',
      },
      {
        name: 'Amenity Management',
        descriptionTemplate:
          '{{businessName}} manages shared amenities including pools, parks, and common areas for the enjoyment of all {{cityRegion}} residents.',
      },
      {
        name: 'Architectural Review',
        descriptionTemplate:
          'Planning a home improvement? {{businessName}} provides clear guidelines and timely architectural review for residents of {{cityRegion}}.',
      },
      {
        name: 'Community Events',
        descriptionTemplate:
          '{{businessName}} organizes social events and gatherings that help {{cityRegion}} residents connect with their neighbors.',
      },
      {
        name: 'Violation Resolution',
        descriptionTemplate:
          'Our team handles community standards enforcement with transparency and fairness for all residents of {{cityRegion}}.',
      },
      {
        name: 'Board Meetings',
        descriptionTemplate:
          '{{businessName}} holds regular board meetings open to {{cityRegion}} residents. Meeting schedules and minutes are available upon request.',
      },
      {
        name: 'New Resident Orientation',
        descriptionTemplate:
          'Welcome to the community! {{businessName}} offers orientation resources to help new {{cityRegion}} residents get settled and informed.',
      },
    ],

    qAndA: [
      {
        question: 'How do I pay my HOA dues?',
        answer: 'Dues can be paid online, by check, or through your bank\'s bill pay service. Contact {{businessName}} for payment portal information.',
      },
      {
        question: 'When are board meetings held?',
        answer: '{{businessName}} holds regular board meetings that are open to all {{cityRegion}} residents. Check our website or community bulletin for the next meeting date.',
      },
      {
        question: 'How do I submit an architectural request?',
        answer: 'Architectural modification requests can be submitted through our website or management office. {{businessName}} aims to review and respond within 30 days.',
      },
      {
        question: 'What amenities are available to residents?',
        answer: 'Community amenities vary — please check with {{businessName}} for a full list of shared facilities and their operating hours in {{cityRegion}}.',
      },
      {
        question: 'How do I report a maintenance issue?',
        answer: 'Report common area maintenance issues through our website or by contacting the {{businessName}} management team directly.',
      },
      {
        question: 'What are the community rules?',
        answer: 'Community guidelines and covenants are provided to all residents and are available on the {{businessName}} website or upon request.',
      },
      {
        question: 'How do I contact the HOA board?',
        answer: 'You can reach the {{businessName}} board through our management office, website, or by attending a scheduled board meeting.',
      },
      {
        question: 'Can I rent out my home?',
        answer: 'Rental policies are outlined in the community covenants. Contact {{businessName}} for specific guidelines that apply in {{cityRegion}}.',
      },
      {
        question: 'How are dues used?',
        answer: 'HOA dues fund common area maintenance, amenity upkeep, insurance, reserves, and community programs. {{businessName}} publishes annual financial reports.',
      },
      {
        question: 'How do I get involved with the HOA?',
        answer: 'Attend a board meeting, volunteer for a committee, or run for a board position. {{businessName}} welcomes resident participation in {{cityRegion}}.',
      },
      {
        question: 'What happens if I have a dispute with a neighbor?',
        answer: '{{businessName}} offers mediation support and clear dispute resolution processes outlined in our community guidelines.',
      },
      {
        question: 'Are pets allowed in the community?',
        answer: 'Pet policies including breed restrictions and leash rules are outlined in the {{businessName}} community covenants. Contact us for details.',
      },
    ],

    photoChecklist: [
      { item: 'Community entrance or signage', why: 'The most searched photo for HOA communities. A clean entrance photo signals a well-maintained neighborhood.', priority: 'high' },
      { item: 'Common area or clubhouse', why: 'Shows the shared spaces that set your community apart from surrounding neighborhoods.', priority: 'high' },
      { item: 'Pool, park, or playground', why: 'Amenity photos are what prospective residents and realtors look for most.', priority: 'high' },
      { item: 'Landscaped common areas', why: 'Well-maintained landscaping demonstrates active community management and curb appeal.', priority: 'medium' },
      { item: 'Community event in action', why: 'Shows the social side of your community and that residents actually connect.', priority: 'medium' },
      { item: 'Walking trails or green spaces', why: 'Outdoor recreation areas are a major selling point for families.', priority: 'medium' },
      { item: 'Seasonal decorations or holiday display', why: 'Shows personality and community spirit that makes the neighborhood feel special.', priority: 'low' },
      { item: 'Board meeting or resident gathering', why: 'Demonstrates active governance and resident engagement.', priority: 'low' },
      { item: 'Maintenance team at work', why: 'Shows the effort behind keeping the community looking its best.', priority: 'low' },
      { item: 'Cover photo — aerial or entrance wide shot (16:9)', why: 'A wide shot of the community entrance or aerial view works best as the GBP banner.', priority: 'low' },
    ],

    postTemplates: {
      intro: {
        body: 'Welcome to {{businessName}} in {{cityRegion}}! Our homeowners association is dedicated to keeping our community beautiful, well-maintained, and connected. From shared amenities and community events to responsive maintenance and clear communication, we work to make this neighborhood a great place to live. Whether you are a current resident or exploring the area, we are glad you are here.',
        cta: 'Visit our website for community info, meeting schedules, and contact details.',
      },
      event: {
        body: '{{businessName}} is planning a community event for {{cityRegion}} residents! This is a wonderful opportunity to meet your neighbors, enjoy our shared amenities, and celebrate what makes our community special. Keep an eye on this page and your mailbox for details on date, time, and what to bring.',
        cta: 'Watch for event details coming soon — all residents welcome!',
      },
      impact: {
        body: '{{businessName}} has been hard at work improving our {{cityRegion}} community. Recent upgrades to common areas, landscaping enhancements, and new resident resources are just a few of the ways we are investing in our neighborhood. Thank you to our residents for your continued support and to our board for their dedication.',
        cta: 'Stay connected — follow our page for updates and community news.',
      },
    },

    reviewTemplates: {
      positive:
        'Thank you for the kind words about {{businessName}}! We are proud of our community in {{cityRegion}}, and reviews like yours remind us why this work matters. We look forward to continuing to make this a great place to live.',
      mixed:
        'Thank you for sharing your feedback about {{businessName}}. We take resident concerns seriously and want to ensure our community in {{cityRegion}} meets expectations. Please reach out to our management team so we can address your concerns directly.',
    },
  },

  // ──────────────────────────────────────────────────
  // RETAIL — local shop, boutique
  // ──────────────────────────────────────────────────
  retail: {
    descriptionTemplate:
      '{{businessName}} is a retail shop proudly located in {{cityRegion}}, offering a curated selection of products and a shopping experience that keeps customers coming back. {{businessDescription}} We believe in quality over quantity and take pride in helping every customer find exactly what they need. From seasonal collections to everyday essentials, {{businessName}} is your local destination for thoughtful shopping in {{cityRegion}}. Stop by and see what makes us a neighborhood favorite.',

    categories: {
      primary: 'Retail store',
      secondary: [
        'Gift shop',
        'Boutique',
        'Specialty store',
        'Clothing store',
        'Home goods store',
        'Shopping mall',
      ],
      rationale:
        'Retail store is a safe primary for most shops. If you specialize (clothing, gifts, home goods), use the more specific category as primary for better search matching.',
    },

    services: [
      {
        name: 'In-Store Shopping',
        descriptionTemplate: 'Visit {{businessName}} in {{cityRegion}} to browse our curated selection in person. Our team is always happy to help you find the perfect item.',
      },
      {
        name: 'Gift Wrapping',
        descriptionTemplate: '{{businessName}} offers complimentary gift wrapping on select purchases — perfect for birthdays, holidays, and special occasions in {{cityRegion}}.',
      },
      {
        name: 'Special Orders',
        descriptionTemplate: 'Can\'t find what you need? {{businessName}} takes special orders so we can source specific items for our {{cityRegion}} customers.',
      },
      {
        name: 'Personal Shopping Assistance',
        descriptionTemplate: 'Our team at {{businessName}} provides personalized shopping help for customers in {{cityRegion}} who want expert guidance on selections.',
      },
      {
        name: 'Local Delivery',
        descriptionTemplate: '{{businessName}} offers local delivery within {{cityRegion}} for select orders. Contact us for availability and delivery details.',
      },
      {
        name: 'Gift Cards',
        descriptionTemplate: 'Give the gift of choice with a {{businessName}} gift card — available in-store and perfect for anyone in {{cityRegion}}.',
      },
      {
        name: 'Loyalty Program',
        descriptionTemplate: 'Join the {{businessName}} loyalty program and earn rewards every time you shop with us in {{cityRegion}}.',
      },
      {
        name: 'Returns & Exchanges',
        descriptionTemplate: '{{businessName}} offers a hassle-free return and exchange policy. Shop with confidence knowing we stand behind every product.',
      },
    ],

    qAndA: [
      { question: 'What are your store hours?', answer: 'Our hours are listed on our Google Business Profile. We recommend checking before your visit as hours may vary during holidays.' },
      { question: 'Do you offer gift cards?', answer: 'Yes! {{businessName}} gift cards are available in-store in any denomination.' },
      { question: 'Do you ship orders?', answer: 'Contact {{businessName}} for shipping availability. We may be able to ship select items to customers outside {{cityRegion}}.' },
      { question: 'Can I return or exchange an item?', answer: 'Yes, {{businessName}} has a clear return and exchange policy. Bring your receipt and we will take care of you.' },
      { question: 'Do you carry local products?', answer: 'We love supporting local makers! {{businessName}} carries a selection of locally made products in our {{cityRegion}} store.' },
      { question: 'Is there parking available?', answer: 'Yes, parking is available near our {{cityRegion}} location. Check our Google listing for directions.' },
      { question: 'Do you offer personal shopping?', answer: 'Our team at {{businessName}} is happy to help you find the perfect item. Just ask when you visit us in {{cityRegion}}.' },
      { question: 'Do you have a loyalty program?', answer: 'Yes! Ask about our loyalty program on your next visit to {{businessName}} and start earning rewards.' },
      { question: 'Can I place a special order?', answer: '{{businessName}} accepts special orders for items not currently in stock. Contact us for details and timelines.' },
      { question: 'Do you offer gift wrapping?', answer: 'Yes, we offer gift wrapping on select purchases at our {{cityRegion}} store.' },
      { question: 'What brands do you carry?', answer: 'We curate a selection of quality brands and products. Visit {{businessName}} in {{cityRegion}} to see our current inventory.' },
      { question: 'Are you locally owned?', answer: '{{businessName}} is a locally owned business in {{cityRegion}}. We are proud to be part of this community.' },
    ],

    photoChecklist: [
      { item: 'Storefront exterior with signage', why: 'Helps customers find you and creates a strong first impression in search results.', priority: 'high' },
      { item: 'Interior store layout and displays', why: 'Gives shoppers a feel for your space and product presentation before they visit.', priority: 'high' },
      { item: 'Featured or best-selling products', why: 'Showcases what you offer and draws interest from people browsing your profile.', priority: 'high' },
      { item: 'Staff helping a customer', why: 'Demonstrates the personal, attentive service that sets local retail apart.', priority: 'medium' },
      { item: 'Seasonal or holiday display', why: 'Shows that your store is active, current, and worth visiting throughout the year.', priority: 'medium' },
      { item: 'Checkout or gift wrapping area', why: 'Adds a touch of professionalism and shows attention to the full shopping experience.', priority: 'medium' },
      { item: 'Shopping bags with branding', why: 'A small detail that reinforces brand recognition in photos and real life.', priority: 'low' },
      { item: 'Window display or curbside setup', why: 'Attractive displays draw foot traffic and look great in search results.', priority: 'low' },
      { item: 'Behind-the-scenes or product sourcing', why: 'Builds a story around your products and shows the care behind your curation.', priority: 'low' },
      { item: 'Cover photo — inviting storefront or interior (16:9)', why: 'A warm, wide shot of your store works best as the GBP banner image.', priority: 'low' },
    ],

    postTemplates: {
      intro: {
        body: 'Welcome to {{businessName}} in {{cityRegion}}! We are a local shop that believes shopping should be personal, enjoyable, and meaningful. Our carefully curated selection is chosen with our community in mind — quality products, unique finds, and something for everyone. Whether you are shopping for yourself or looking for the perfect gift, we are here to help. Come visit us and experience the difference of shopping local.',
        cta: 'Stop by {{businessName}} today — we would love to help you find something special.',
      },
      event: {
        body: '{{businessName}} is hosting an in-store event for our {{cityRegion}} customers! Join us for an exclusive shopping experience with special offers, new arrivals, and a chance to connect with your neighbors. These events are our way of saying thank you to the community that supports us. Details coming soon — stay tuned!',
        cta: 'Follow our page for event details and exclusive offers.',
      },
      impact: {
        body: 'Thank you, {{cityRegion}}! Because of your support, {{businessName}} continues to grow and bring new products, brands, and experiences to our community. Shopping local makes a real difference — every purchase supports a small business and keeps our neighborhood vibrant. We are grateful for every customer who walks through our doors.',
        cta: 'Shop local. Shop {{businessName}}. Visit us in {{cityRegion}} today.',
      },
    },

    reviewTemplates: {
      positive:
        'Thank you for your kind review! We love hearing that you had a great experience at {{businessName}} in {{cityRegion}}. Our team works hard to make every visit special, and your words mean the world to us. See you again soon!',
      mixed:
        'We appreciate your feedback and are sorry your experience at {{businessName}} did not meet expectations. We want every customer in {{cityRegion}} to leave happy. Please reach out to us directly so we can make things right.',
    },
  },

  // ──────────────────────────────────────────────────
  // CREATIVE — photographer, designer, artist
  // ──────────────────────────────────────────────────
  creative: {
    descriptionTemplate:
      '{{businessName}} is a creative studio based in {{cityRegion}}, specializing in bringing ideas to life through design, storytelling, and visual craft. {{businessDescription}} We work closely with every client to understand their vision and deliver work that exceeds expectations — whether it is a brand identity, a photo session, a marketing campaign, or a custom creative project. If you are looking for a creative partner in {{cityRegion}} who cares about the details as much as you do, {{businessName}} is here for you.',

    categories: {
      primary: 'Creative agency',
      secondary: [
        'Photographer',
        'Graphic designer',
        'Video production service',
        'Web designer',
        'Art studio',
        'Marketing agency',
        'Print shop',
      ],
      rationale:
        'Creative agency works as a broad primary. If you specialize (photography, graphic design, video), use the more specific category to improve search relevance.',
    },

    services: [
      {
        name: 'Brand Identity Design',
        descriptionTemplate: '{{businessName}} creates cohesive brand identities for businesses in {{cityRegion}} — from logos and color palettes to full brand guides.',
      },
      {
        name: 'Photography',
        descriptionTemplate: 'Professional photography by {{businessName}} for portraits, products, events, and commercial projects in {{cityRegion}}.',
      },
      {
        name: 'Graphic Design',
        descriptionTemplate: '{{businessName}} delivers print and digital design for businesses in {{cityRegion}} including flyers, social media assets, and packaging.',
      },
      {
        name: 'Video Production',
        descriptionTemplate: 'From concept to final cut, {{businessName}} produces video content for {{cityRegion}} businesses that tells your story and engages your audience.',
      },
      {
        name: 'Website Design',
        descriptionTemplate: '{{businessName}} designs modern, responsive websites that help {{cityRegion}} businesses look professional and convert visitors to customers.',
      },
      {
        name: 'Social Media Content',
        descriptionTemplate: 'We create scroll-stopping social media content for businesses in {{cityRegion}} that builds engagement and strengthens your brand.',
      },
      {
        name: 'Print Materials',
        descriptionTemplate: '{{businessName}} designs and coordinates print production for business cards, brochures, signage, and more in {{cityRegion}}.',
      },
      {
        name: 'Creative Consultation',
        descriptionTemplate: 'Not sure where to start? {{businessName}} offers creative consultations to help {{cityRegion}} businesses define their visual direction.',
      },
    ],

    qAndA: [
      { question: 'What creative services does {{businessName}} offer?', answer: 'We offer branding, photography, graphic design, video production, web design, and more for businesses in {{cityRegion}}.' },
      { question: 'How do I get a quote from {{businessName}}?', answer: 'Contact us through our website or Google Business Profile with your project details and we will send a custom quote.' },
      { question: 'Do you work with small businesses?', answer: 'Absolutely! {{businessName}} loves working with small businesses in {{cityRegion}} to build brands that stand out.' },
      { question: 'How long does a typical project take?', answer: 'Timelines vary by project scope. A logo may take 2-3 weeks, while a full brand identity can take 6-8 weeks. We provide clear timelines upfront.' },
      { question: 'Can I see your portfolio?', answer: 'Yes! Visit the {{businessName}} website to browse our portfolio of work for clients in {{cityRegion}} and beyond.' },
      { question: 'Do you offer rush services?', answer: '{{businessName}} can accommodate rush projects for an additional fee. Contact us to discuss your timeline.' },
      { question: 'What is your revision process?', answer: 'Our packages include a set number of revision rounds so you get exactly what you envision. We keep the process collaborative and transparent.' },
      { question: 'Do you work with clients outside {{cityRegion}}?', answer: 'Yes, while {{businessName}} is based in {{cityRegion}}, we work with clients remotely across the region.' },
      { question: 'What file formats do you deliver?', answer: 'We deliver files in all standard formats (PDF, PNG, JPG, SVG, etc.) along with source files as specified in your project agreement.' },
      { question: 'Do you offer ongoing creative support?', answer: 'Yes, {{businessName}} offers monthly retainer packages for businesses in {{cityRegion}} that need consistent creative output.' },
      { question: 'Can you help with both print and digital?', answer: 'Absolutely. {{businessName}} handles both print and digital design so your brand looks consistent everywhere.' },
      { question: 'How do I get started?', answer: 'Reach out via our website or Google listing to schedule a free consultation. We will discuss your vision and map out next steps.' },
    ],

    photoChecklist: [
      { item: 'Portfolio highlight — best finished work', why: 'Your work IS your marketing. Lead with your strongest piece to immediately demonstrate quality.', priority: 'high' },
      { item: 'Studio or workspace', why: 'A creative workspace photo adds personality and shows the environment where the magic happens.', priority: 'high' },
      { item: 'Professional headshot or team photo', why: 'Clients hire people, not logos. A great headshot builds connection before the first meeting.', priority: 'high' },
      { item: 'Behind-the-scenes of a shoot or project', why: 'Process photos add authenticity and show the effort and skill behind your finished work.', priority: 'medium' },
      { item: 'Before and after or work in progress', why: 'Transformation photos are compelling proof of your creative impact.', priority: 'medium' },
      { item: 'Client deliverables in context', why: 'Show your work in the real world — printed materials, live websites, or installed signage.', priority: 'medium' },
      { item: 'Equipment and tools', why: 'Professional tools signal professional results and investment in quality.', priority: 'low' },
      { item: 'Client meeting or creative session', why: 'Shows your collaborative process and approachable working style.', priority: 'low' },
      { item: 'Awards or published features', why: 'External recognition builds credibility with prospective clients.', priority: 'low' },
      { item: 'Cover photo — signature work or studio shot (16:9)', why: 'Your best visual work or an inviting studio shot at 16:9 for the GBP banner.', priority: 'low' },
    ],

    postTemplates: {
      intro: {
        body: '{{businessName}} is a creative studio in {{cityRegion}} that helps businesses look as good as they are. Whether you need a new brand identity, photography for your next campaign, or a website that actually converts, our team brings a blend of artistry and strategy to every project. We believe great design is not just about aesthetics — it is about telling your story in a way that resonates with the right people.',
        cta: 'Visit our website to see our portfolio and schedule a free consultation.',
      },
      event: {
        body: '{{businessName}} is hosting a creative event in {{cityRegion}}! Whether it is a portfolio showcase, a mini session day, or a collaborative workshop, we love connecting with our community. These events are a great way to meet our team, see our work up close, and explore what we can create together. Stay tuned for details!',
        cta: 'Follow our page for event announcements and booking info.',
      },
      impact: {
        body: 'We just wrapped a project we are really proud of — another {{cityRegion}} business now has a brand that truly represents who they are. At {{businessName}}, every project is personal. We do not do cookie-cutter. We listen, we create, and we deliver work that our clients are excited to share. Thank you to everyone who has trusted us with their vision.',
        cta: 'Ready to bring your vision to life? Contact {{businessName}} to get started.',
      },
    },

    reviewTemplates: {
      positive:
        'Thank you for the wonderful review! At {{businessName}}, we pour our creativity and care into every project, and it is incredibly rewarding to hear that you love the result. We enjoyed working with you and hope to collaborate again in {{cityRegion}}!',
      mixed:
        'We appreciate your honest feedback. At {{businessName}}, we strive to exceed expectations on every project, and we want to make sure your experience reflects that. Please reach out to us directly — we would love to discuss how we can make this right.',
    },
  },

  // ──────────────────────────────────────────────────
  // TECHNOLOGY — IT company, web agency, software firm
  // ──────────────────────────────────────────────────
  technology: {
    descriptionTemplate:
      '{{businessName}} is a technology company based in {{cityRegion}}, delivering modern solutions that help businesses operate smarter, grow faster, and stay secure. {{businessDescription}} From custom software and web development to IT support and cloud infrastructure, our team combines technical expertise with a clear understanding of business goals. We work with organizations of all sizes in {{cityRegion}} to build systems that scale, reduce complexity, and drive real results.',

    categories: {
      primary: 'Information technology company',
      secondary: [
        'Software company',
        'Web designer',
        'Computer support and services',
        'Internet marketing service',
        'IT consulting',
        'App developer',
        'Computer security service',
      ],
      rationale:
        'Information technology company is a strong umbrella primary. Use a more specific category (Software company, IT consulting, etc.) if that better describes your core offering.',
    },

    services: [
      {
        name: 'Custom Software Development',
        descriptionTemplate: '{{businessName}} builds custom software solutions for businesses in {{cityRegion}} that streamline operations and solve real problems.',
      },
      {
        name: 'Web Development',
        descriptionTemplate: 'We design and develop modern, responsive websites that help {{cityRegion}} businesses attract customers and grow online.',
      },
      {
        name: 'IT Support & Managed Services',
        descriptionTemplate: '{{businessName}} provides reliable IT support and managed services that keep {{cityRegion}} businesses running without interruption.',
      },
      {
        name: 'Cloud Solutions',
        descriptionTemplate: 'Migrate, manage, and optimize your cloud infrastructure with {{businessName}} — serving businesses across {{cityRegion}}.',
      },
      {
        name: 'Cybersecurity',
        descriptionTemplate: 'Protect your business with cybersecurity assessments, monitoring, and remediation from {{businessName}} in {{cityRegion}}.',
      },
      {
        name: 'Digital Marketing',
        descriptionTemplate: '{{businessName}} helps {{cityRegion}} businesses grow their online presence through SEO, paid advertising, and content strategy.',
      },
      {
        name: 'System Integration',
        descriptionTemplate: 'We connect your tools, platforms, and data systems so everything works together seamlessly for your {{cityRegion}} business.',
      },
      {
        name: 'Technology Consulting',
        descriptionTemplate: 'Not sure what you need? {{businessName}} offers technology consulting to help {{cityRegion}} businesses make smart, future-proof decisions.',
      },
    ],

    qAndA: [
      { question: 'What technology services does {{businessName}} offer?', answer: 'We offer web development, custom software, IT support, cloud solutions, cybersecurity, and digital marketing for businesses in {{cityRegion}}.' },
      { question: 'Do you work with small businesses?', answer: 'Yes! {{businessName}} works with businesses of all sizes in {{cityRegion}}, from startups to established organizations.' },
      { question: 'How do I get a project estimate?', answer: 'Contact {{businessName}} through our website or Google listing with your project details. We will schedule a free discovery call and provide a detailed estimate.' },
      { question: 'Do you offer ongoing support?', answer: 'Yes, {{businessName}} offers managed service plans and ongoing support agreements for {{cityRegion}} businesses that need reliable, proactive IT care.' },
      { question: 'What industries do you serve?', answer: 'We serve a wide range of industries in {{cityRegion}} including healthcare, finance, retail, nonprofit, and professional services.' },
      { question: 'Can you help with an existing system?', answer: 'Absolutely. {{businessName}} can audit, optimize, or rebuild existing systems to improve performance, security, and usability.' },
      { question: 'How long does a typical project take?', answer: 'Project timelines vary based on scope. A website may take 4-8 weeks, while custom software can take 3-6 months. We provide clear timelines upfront.' },
      { question: 'Do you provide training?', answer: 'Yes, {{businessName}} offers training and documentation so your {{cityRegion}} team can confidently use the tools we build.' },
      { question: 'Are you local to {{cityRegion}}?', answer: 'Yes, {{businessName}} is based in {{cityRegion}} and we value the relationships we build with local businesses.' },
      { question: 'What technologies do you work with?', answer: 'Our team works with modern frameworks, cloud platforms, and enterprise tools. Contact us for specifics related to your project needs.' },
      { question: 'Do you offer cybersecurity assessments?', answer: '{{businessName}} provides comprehensive security assessments to help {{cityRegion}} businesses identify vulnerabilities and strengthen their defenses.' },
      { question: 'How do I get started?', answer: 'Reach out through our website or Google listing to schedule a free consultation. We will discuss your goals and recommend the best path forward.' },
    ],

    photoChecklist: [
      { item: 'Team photo in professional setting', why: 'Tech is a people business. Showing your team builds trust and differentiates from faceless agencies.', priority: 'high' },
      { item: 'Office or workspace', why: 'A professional workspace signals stability and legitimacy, especially important for tech companies.', priority: 'high' },
      { item: 'Screenshots or demos of your work', why: 'Show what you build. Product screenshots and live demos are your most compelling portfolio pieces.', priority: 'high' },
      { item: 'Team working collaboratively', why: 'Action shots of developers, designers, or strategists working together show your process.', priority: 'medium' },
      { item: 'Client meeting or presentation', why: 'Demonstrates your professionalism and how you engage with clients.', priority: 'medium' },
      { item: 'Whiteboard or planning session', why: 'Shows the strategic thinking behind your technical execution.', priority: 'medium' },
      { item: 'Conference or tech event presence', why: 'Positions your team as active in the broader tech community.', priority: 'low' },
      { item: 'Company branding and swag', why: 'Reinforces brand identity across search results and social platforms.', priority: 'low' },
      { item: 'Server room or infrastructure', why: 'For managed service providers, showing your infrastructure builds confidence.', priority: 'low' },
      { item: 'Cover photo — team, office, or product showcase (16:9)', why: 'A wide shot of your team or workspace works best as the GBP banner.', priority: 'low' },
    ],

    postTemplates: {
      intro: {
        body: '{{businessName}} is a technology company in {{cityRegion}} that builds solutions businesses actually need. Whether you are looking for a modern website, custom software, IT support, or help with your cloud infrastructure, our team combines deep technical skills with a genuine commitment to your success. We do not just write code — we solve problems and build systems that grow with you.',
        cta: 'Schedule a free consultation at our website to discuss your technology needs.',
      },
      event: {
        body: '{{businessName}} is hosting a technology event in {{cityRegion}}! Whether it is a lunch-and-learn, a cybersecurity workshop, or a tech meetup, we are passionate about sharing knowledge and connecting with fellow professionals. These events are free, open to all, and a great way to stay current on the tools and trends shaping local business.',
        cta: 'Follow our page for event details and registration links.',
      },
      impact: {
        body: 'Another successful launch! {{businessName}} recently delivered a project for a {{cityRegion}} business that transformed how they operate — from manual processes to streamlined, automated workflows. This is what drives us: building technology that makes a measurable difference. Thank you to our clients for trusting us with your most important systems.',
        cta: 'Ready to modernize your business? Contact {{businessName}} to get started.',
      },
    },

    reviewTemplates: {
      positive:
        'Thank you for the great review! At {{businessName}}, we are passionate about building technology that works for real businesses in {{cityRegion}}. It is rewarding to hear that our work is making a difference for your team. We look forward to continuing the partnership!',
      mixed:
        'We appreciate your feedback and take it seriously. At {{businessName}}, we hold ourselves to a high standard and want every client in {{cityRegion}} to feel confident in our work. Please contact us directly so we can discuss your experience and make it right.',
    },
  },
}
