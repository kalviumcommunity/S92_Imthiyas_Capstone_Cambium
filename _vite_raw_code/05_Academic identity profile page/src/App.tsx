import { useState, useRef, useCallback, useEffect, type ChangeEvent } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProfileData {
  photo: string | null
  name: string
  headline: string
  country: string
  city: string
  bio: string
  institution: string
  department: string
  position: string
  academicLevel: string
  researchLab: string
  startYear: string
  graduation: string
  interests: string[]
  researchDescription: string
  researchGoals: string[]
  skills: Record<string, string>
  links: Record<string, string>
}

const INITIAL: ProfileData = {
  photo: null,
  name: 'Maya Chen',
  headline: 'PhD Researcher in Medical Imaging',
  country: 'India',
  city: 'Chennai',
  bio: 'PhD researcher working at the intersection of medical imaging and machine learning. My current research focuses on reliable computer vision systems for low-resource clinical environments.',
  institution: 'AMET University',
  department: 'Department of Computer Science',
  position: 'Research Assistant',
  academicLevel: 'PhD',
  researchLab: 'AI & Medical Imaging Lab',
  startYear: '2022',
  graduation: '2026',
  interests: ['Medical Imaging', 'Computer Vision', 'Machine Learning'],
  researchDescription:
    'Developing lightweight segmentation models for medical imaging in environments with limited labeled data.',
  researchGoals: ['Publish research', 'Find collaborators', 'Find datasets'],
  skills: {
    Python: 'Advanced',
    PyTorch: 'Advanced',
    OpenCV: 'Intermediate',
    LaTeX: 'Intermediate',
    Git: 'Intermediate',
  },
  links: {
    ORCID: 'orcid.org/0000-0001-2345-6789',
    'Google Scholar': '',
    GitHub: 'github.com/mayachen',
    LinkedIn: '',
    ResearchGate: '',
    'Semantic Scholar': '',
    'Personal Website': '',
    X: '',
  },
}

const STEPS = [
  { num: '01', label: 'Basic Identity' },
  { num: '02', label: 'Institution' },
  { num: '03', label: 'Research' },
  { num: '04', label: 'Expertise' },
  { num: '05', label: 'Academic Links' },
  { num: '06', label: 'Review' },
]

const RESEARCH_DOMAINS = [
  'Artificial Intelligence',
  'Machine Learning',
  'Computer Vision',
  'Medical Imaging',
  'Deep Learning',
  'Federated Learning',
  'Natural Language Processing',
  'Robotics',
  'Cybersecurity',
  'Bioinformatics',
  'Healthcare',
  'Climate Science',
  'Quantum Computing',
  'Materials Science',
  'Physics',
  'Economics',
  'Social Sciences',
]

const RESEARCH_GOAL_OPTIONS = [
  'Publish research',
  'Find collaborators',
  'Discover funding',
  'Find conferences',
  'Find journals',
  'Find datasets',
  'Share research',
  'Build academic portfolio',
  'Open-source research',
  'Find mentors',
]

const SKILL_CATEGORIES: Record<string, string[]> = {
  'Technical Skills': ['Python', 'R', 'MATLAB', 'SQL', 'CUDA', 'C++', 'Julia'],
  'Tools & Frameworks': [
    'PyTorch',
    'TensorFlow',
    'OpenCV',
    'Jupyter',
    'Git',
    'GitHub',
    'Docker',
    'LaTeX',
  ],
  'Research Methods': [
    'Statistical Analysis',
    'Experimental Design',
    'Systematic Reviews',
    'Data Analysis',
    'Qualitative Research',
    'Mixed Methods',
  ],
  'Academic Skills': [
    'Literature Review',
    'Grant Writing',
    'Peer Review',
    'Science Communication',
    'Teaching',
    'Mentoring',
  ],
}

const EXPERTISE_LEVELS = ['Familiar', 'Intermediate', 'Advanced', 'Expert']

const LINK_PLATFORMS = [
  { key: 'ORCID', icon: '○' },
  { key: 'Google Scholar', icon: '◈' },
  { key: 'GitHub', icon: '◉' },
  { key: 'LinkedIn', icon: '▣' },
  { key: 'ResearchGate', icon: '◫' },
  { key: 'Semantic Scholar', icon: '◆' },
  { key: 'Personal Website', icon: '◻' },
  { key: 'X', icon: '✕' },
]

const ACADEMIC_LEVELS = [
  'Undergraduate',
  "Master's",
  'PhD',
  'Postdoctoral',
  'Faculty',
  'Industry Researcher',
  'Independent Researcher',
]

// ─── Utility components ───────────────────────────────────────────────────────

function Label({ children, htmlFor }: { children: React.ReactNode; htmlFor?: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-1.5"
    >
      {children}
    </label>
  )
}

function Input({
  value,
  onChange,
  placeholder,
  id,
  type = 'text',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  id?: string
  type?: string
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 px-3.5 bg-white border border-[#DEDAD2] rounded-[4px] text-[14px] text-[#1A1A18] placeholder:text-[#C0BDB5] focus:border-[#2E5E1E] focus:ring-2 focus:ring-[#2E5E1E]/10 transition-all duration-150"
    />
  )
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 5,
  maxLength,
  id,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  rows?: number
  maxLength?: number
  id?: string
}) {
  return (
    <textarea
      id={id}
      value={value}
      onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      maxLength={maxLength}
      className="w-full px-3.5 py-3 bg-white border border-[#DEDAD2] rounded-[4px] text-[14px] text-[#1A1A18] placeholder:text-[#C0BDB5] focus:border-[#2E5E1E] focus:ring-2 focus:ring-[#2E5E1E]/10 transition-all duration-150 resize-none leading-relaxed"
    />
  )
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  id,
}: {
  value: string
  onChange: (v: string) => void
  options: string[]
  placeholder?: string
  id?: string
}) {
  return (
    <select
      id={id}
      value={value}
      onChange={(e: ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
      className="w-full h-10 px-3.5 bg-white border border-[#DEDAD2] rounded-[4px] text-[14px] text-[#1A1A18] focus:border-[#2E5E1E] focus:ring-2 focus:ring-[#2E5E1E]/10 transition-all duration-150 appearance-none cursor-pointer"
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  )
}

function Chip({
  label,
  selected,
  onClick,
}: {
  label: string
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1.5 rounded-[3px] text-[13px] font-medium border transition-all duration-150 leading-none ${
        selected
          ? 'bg-[#EAF1E6] border-[#3B7425] text-[#2E5E1E]'
          : 'bg-white border-[#DEDAD2] text-[#4A4845] hover:border-[#AAAA99] hover:bg-[#F6F4EF]'
      }`}
    >
      {label}
    </button>
  )
}

// ─── Profile Strength ─────────────────────────────────────────────────────────

function calcStrength(profile: ProfileData, step: number): number {
  let pts = 0
  if (profile.name) pts += 10
  if (profile.headline) pts += 10
  if (profile.bio) pts += 10
  if (profile.country) pts += 5
  if (profile.city) pts += 5
  if (profile.institution) pts += 10
  if (profile.academicLevel) pts += 5
  if (profile.interests.length >= 3) pts += 15
  if (Object.keys(profile.skills).length >= 3) pts += 10
  const connectedLinks = Object.values(profile.links).filter(Boolean).length
  if (connectedLinks >= 1) pts += 10
  if (connectedLinks >= 2) pts += 5
  if (step >= 5) pts += 5
  return Math.min(100, pts)
}

function StrengthBar({ value }: { value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F]">
          Profile Strength
        </span>
        <span className="text-[13px] font-semibold text-[#2E5E1E]">{value}%</span>
      </div>
      <div className="h-1 bg-[#DEDAD2] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#2E5E1E] rounded-full transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

// ─── Left Rail ────────────────────────────────────────────────────────────────

function LeftRail({
  currentStep,
  completedSteps,
  onStepClick,
  strength,
  saveStatus,
}: {
  currentStep: number
  completedSteps: Set<number>
  onStepClick: (i: number) => void
  strength: number
  saveStatus: string
}) {
  return (
    <aside className="flex flex-col h-full border-r border-[#DEDAD2] bg-[#F2F0EB] px-6 py-8">
      {/* Logo */}
      <div className="mb-8">
        <div className="text-[16px] font-semibold tracking-[0.12em] text-[#1A1A18] uppercase">
          Cambium
        </div>
        <div className="text-[10px] font-medium tracking-[0.15em] text-[#7A786F] uppercase mt-0.5">
          Create your academic identity
        </div>
      </div>

      {/* Strength */}
      <div className="mb-8 p-4 bg-white border border-[#DEDAD2] rounded-[4px]">
        <StrengthBar value={strength} />
      </div>

      {/* Steps */}
      <nav className="flex-1 space-y-0.5">
        {STEPS.map((step, i) => {
          const done = completedSteps.has(i)
          const active = currentStep === i
          const accessible = done || i <= currentStep
          return (
            <button
              key={i}
              type="button"
              onClick={() => accessible && onStepClick(i)}
              disabled={!accessible}
              className={`w-full text-left px-3 py-3 rounded-[3px] flex items-center gap-3 transition-all duration-150 group ${
                active
                  ? 'bg-white border border-[#DEDAD2] shadow-[0_1px_3px_rgba(0,0,0,0.04)]'
                  : done
                    ? 'hover:bg-white/60 cursor-pointer'
                    : i < currentStep
                      ? 'hover:bg-white/60 cursor-pointer'
                      : 'opacity-40 cursor-not-allowed'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-semibold transition-all duration-150 ${
                  done
                    ? 'bg-[#2E5E1E] text-white'
                    : active
                      ? 'bg-[#1A1A18] text-white'
                      : 'bg-[#DEDAD2] text-[#7A786F]'
                }`}
              >
                {done ? '✓' : step.num}
              </span>
              <span
                className={`text-[13px] font-medium transition-colors ${
                  active ? 'text-[#1A1A18]' : done ? 'text-[#4A4845]' : 'text-[#7A786F]'
                }`}
              >
                {step.label}
              </span>
              {active && (
                <span className="ml-auto w-1 h-4 bg-[#2E5E1E] rounded-full" aria-hidden />
              )}
            </button>
          )
        })}
      </nav>

      {/* Auto-save */}
      <div className="mt-8 pt-4 border-t border-[#DEDAD2]">
        <p className="text-[11px] text-[#A8A59C]">Your progress is saved automatically.</p>
        <p className="text-[11px] text-[#7A786F] mt-0.5 font-medium">{saveStatus}</p>
      </div>
    </aside>
  )
}

// ─── Step 01 — Basic Identity ─────────────────────────────────────────────────

function Step01({
  profile,
  update,
}: {
  profile: ProfileData
  update: (patch: Partial<ProfileData>) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handlePhoto = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => update({ photo: ev.target?.result as string })
    reader.readAsDataURL(file)
  }

  return (
    <div className="step-enter space-y-8">
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-1">
          Step 01 of 06 — Basic Identity
        </p>
        <h2 className="text-[26px] font-semibold text-[#1A1A18] tracking-tight leading-snug">
          Start with who you are.
        </h2>
        <p className="text-[14px] text-[#7A786F] mt-1.5">
          Introduce yourself to the research community.
        </p>
      </div>

      {/* Photo */}
      <div>
        <Label>Profile photo</Label>
        <div className="flex items-start gap-5">
          <div
            className="w-[88px] h-[88px] rounded-full bg-[#E8E5DF] border-2 border-[#DEDAD2] overflow-hidden flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => fileRef.current?.click()}
          >
            {profile.photo ? (
              <img src={profile.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=176&h=176&fit=crop&auto=format"
                  alt="Profile placeholder"
                  className="w-full h-full object-cover opacity-60"
                />
              </div>
            )}
          </div>
          <div className="pt-1">
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="px-4 py-2 bg-[#1A1A18] text-white text-[13px] font-medium rounded-[3px] hover:bg-[#2E2E2B] transition-colors"
            >
              Upload photo
            </button>
            {profile.photo && (
              <button
                type="button"
                onClick={() => update({ photo: null })}
                className="ml-2.5 px-3 py-2 text-[13px] text-[#7A786F] hover:text-[#1A1A18] transition-colors"
              >
                Remove
              </button>
            )}
            <p className="text-[12px] text-[#A8A59C] mt-2">Use a clear, professional photo.</p>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhoto}
            aria-label="Upload profile photo"
          />
        </div>
      </div>

      {/* Name */}
      <div>
        <Label htmlFor="name">Full name</Label>
        <Input
          id="name"
          value={profile.name}
          onChange={(v) => update({ name: v })}
          placeholder="Maya Chen"
        />
      </div>

      {/* Headline */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <Label htmlFor="headline">Academic / professional headline</Label>
          <span className="text-[11px] text-[#A8A59C]">
            {profile.headline.length} / 80
          </span>
        </div>
        <Input
          id="headline"
          value={profile.headline}
          onChange={(v) => update({ headline: v.slice(0, 80) })}
          placeholder="PhD Researcher in Medical Imaging"
        />
        <p className="text-[12px] text-[#A8A59C] mt-1.5">
          Describe your role or research focus in one line.
        </p>
      </div>

      {/* Location */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            value={profile.country}
            onChange={(v) => update({ country: v })}
            placeholder="India"
          />
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={profile.city}
            onChange={(v) => update({ city: v })}
            placeholder="Chennai"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <Label htmlFor="bio">About you</Label>
          <span className="text-[11px] text-[#A8A59C]">{profile.bio.length} / 500</span>
        </div>
        <Textarea
          id="bio"
          value={profile.bio}
          onChange={(v) => update({ bio: v.slice(0, 500) })}
          placeholder="Tell the research community about yourself, your research interests, and what you're currently working on."
          rows={5}
          maxLength={500}
        />
      </div>
    </div>
  )
}

// ─── Step 02 — Institution ────────────────────────────────────────────────────

function Step02({
  profile,
  update,
}: {
  profile: ProfileData
  update: (patch: Partial<ProfileData>) => void
}) {
  return (
    <div className="step-enter space-y-8">
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-1">
          Step 02 of 06 — Institution
        </p>
        <h2 className="text-[26px] font-semibold text-[#1A1A18] tracking-tight leading-snug">
          Where do you conduct your research?
        </h2>
        <p className="text-[14px] text-[#7A786F] mt-1.5">
          Your institutional affiliation and academic position.
        </p>
      </div>

      <div>
        <Label htmlFor="institution">Institution</Label>
        <Input
          id="institution"
          value={profile.institution}
          onChange={(v) => update({ institution: v })}
          placeholder="University or research institute"
        />
        <p className="text-[12px] text-[#A8A59C] mt-1.5">
          Start typing to search institutions.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="department">Department</Label>
          <Input
            id="department"
            value={profile.department}
            onChange={(v) => update({ department: v })}
            placeholder="Department of Computer Science"
          />
        </div>
        <div>
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            value={profile.position}
            onChange={(v) => update({ position: v })}
            placeholder="Research Assistant"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="academicLevel">Academic level</Label>
        <Select
          id="academicLevel"
          value={profile.academicLevel}
          onChange={(v) => update({ academicLevel: v })}
          options={ACADEMIC_LEVELS}
          placeholder="Select your level"
        />
      </div>

      <div>
        <Label htmlFor="researchLab">Research lab or group</Label>
        <Input
          id="researchLab"
          value={profile.researchLab}
          onChange={(v) => update({ researchLab: v })}
          placeholder="AI & Medical Imaging Lab"
        />
        <p className="text-[12px] text-[#A8A59C] mt-1.5">Optional</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="startYear">Start year</Label>
          <Input
            id="startYear"
            value={profile.startYear}
            onChange={(v) => update({ startYear: v })}
            placeholder="2022"
          />
        </div>
        <div>
          <Label htmlFor="graduation">Expected graduation</Label>
          <Input
            id="graduation"
            value={profile.graduation}
            onChange={(v) => update({ graduation: v })}
            placeholder="2026"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Step 03 — Research ───────────────────────────────────────────────────────

function Step03({
  profile,
  update,
}: {
  profile: ProfileData
  update: (patch: Partial<ProfileData>) => void
}) {
  const [search, setSearch] = useState('')

  const toggleInterest = (item: string) => {
    update({
      interests: profile.interests.includes(item)
        ? profile.interests.filter((x) => x !== item)
        : [...profile.interests, item],
    })
  }

  const toggleGoal = (goal: string) => {
    update({
      researchGoals: profile.researchGoals.includes(goal)
        ? profile.researchGoals.filter((g) => g !== goal)
        : [...profile.researchGoals, goal],
    })
  }

  const filtered = RESEARCH_DOMAINS.filter((d) =>
    d.toLowerCase().includes(search.toLowerCase()),
  )

  return (
    <div className="step-enter space-y-8">
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-1">
          Step 03 of 06 — Research
        </p>
        <h2 className="text-[26px] font-semibold text-[#1A1A18] tracking-tight leading-snug">
          What are you researching?
        </h2>
        <p className="text-[14px] text-[#7A786F] mt-1.5">
          Tell Cambium what areas of research define your work.
        </p>
      </div>

      {/* Selected chips */}
      {profile.interests.length > 0 && (
        <div>
          <Label>Selected interests</Label>
          <div className="flex flex-wrap gap-2">
            {profile.interests.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => toggleInterest(tag)}
                className="px-3 py-1.5 bg-[#EAF1E6] border border-[#3B7425] text-[#2E5E1E] text-[13px] font-medium rounded-[3px] flex items-center gap-1.5 transition-all duration-150"
              >
                {tag}
                <span className="text-[#3B7425] opacity-70 text-[11px]">✕</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search + domains */}
      <div>
        <Label>Search research areas</Label>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search interests or add your own..."
          className="w-full h-10 px-3.5 bg-white border border-[#DEDAD2] rounded-[4px] text-[14px] text-[#1A1A18] placeholder:text-[#C0BDB5] focus:border-[#2E5E1E] focus:ring-2 focus:ring-[#2E5E1E]/10 transition-all duration-150 mb-3"
        />
        <div className="flex flex-wrap gap-2">
          {filtered.map((domain) => (
            <Chip
              key={domain}
              label={domain}
              selected={profile.interests.includes(domain)}
              onClick={() => toggleInterest(domain)}
            />
          ))}
          {search && !filtered.includes(search) && (
            <button
              type="button"
              onClick={() => {
                update({ interests: [...profile.interests, search] })
                setSearch('')
              }}
              className="px-3 py-1.5 border border-dashed border-[#3B7425] text-[#2E5E1E] text-[13px] rounded-[3px] hover:bg-[#EAF1E6] transition-all duration-150"
            >
              + Add "{search}"
            </button>
          )}
        </div>
      </div>

      {/* Current research */}
      <div>
        <div className="flex items-baseline justify-between mb-1.5">
          <Label htmlFor="researchDescription">Current research focus</Label>
        </div>
        <Textarea
          id="researchDescription"
          value={profile.researchDescription}
          onChange={(v) => update({ researchDescription: v })}
          placeholder="Describe what you're currently working on..."
          rows={4}
        />
      </div>

      {/* Goals */}
      <div>
        <Label>Research goals</Label>
        <p className="text-[12px] text-[#A8A59C] mb-3">
          What do you want to accomplish on Cambium?
        </p>
        <div className="flex flex-wrap gap-2">
          {RESEARCH_GOAL_OPTIONS.map((goal) => (
            <Chip
              key={goal}
              label={goal}
              selected={profile.researchGoals.includes(goal)}
              onClick={() => toggleGoal(goal)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Step 04 — Expertise ──────────────────────────────────────────────────────

function Step04({
  profile,
  update,
}: {
  profile: ProfileData
  update: (patch: Partial<ProfileData>) => void
}) {
  const toggleSkill = (skill: string) => {
    const next = { ...profile.skills }
    if (next[skill] !== undefined) {
      delete next[skill]
    } else {
      next[skill] = 'Intermediate'
    }
    update({ skills: next })
  }

  const setLevel = (skill: string, level: string) => {
    update({ skills: { ...profile.skills, [skill]: level } })
  }

  return (
    <div className="step-enter space-y-8">
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-1">
          Step 04 of 06 — Expertise
        </p>
        <h2 className="text-[26px] font-semibold text-[#1A1A18] tracking-tight leading-snug">
          What can you contribute?
        </h2>
        <p className="text-[14px] text-[#7A786F] mt-1.5">
          Select your skills and tools. Expertise levels are optional.
        </p>
      </div>

      {Object.entries(SKILL_CATEGORIES).map(([category, skills]) => (
        <div key={category}>
          <Label>{category}</Label>
          <div className="space-y-1.5">
            {skills.map((skill) => {
              const selected = profile.skills[skill] !== undefined
              return (
                <div key={skill} className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`flex-shrink-0 px-3 py-1.5 text-[13px] font-medium rounded-[3px] border transition-all duration-150 min-w-[120px] text-left ${
                      selected
                        ? 'bg-[#EAF1E6] border-[#3B7425] text-[#2E5E1E]'
                        : 'bg-white border-[#DEDAD2] text-[#4A4845] hover:border-[#AAAA99]'
                    }`}
                  >
                    {skill}
                  </button>
                  {selected && (
                    <div className="flex gap-1">
                      {EXPERTISE_LEVELS.map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setLevel(skill, level)}
                          className={`px-2.5 py-1 text-[11px] rounded-[2px] border transition-all duration-150 ${
                            profile.skills[skill] === level
                              ? 'bg-[#1A1A18] border-[#1A1A18] text-white'
                              : 'bg-white border-[#DEDAD2] text-[#7A786F] hover:border-[#7A786F]'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Step 05 — Links ──────────────────────────────────────────────────────────

function Step05({
  profile,
  update,
}: {
  profile: ProfileData
  update: (patch: Partial<ProfileData>) => void
}) {
  return (
    <div className="step-enter space-y-8">
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-1">
          Step 05 of 06 — Academic Links
        </p>
        <h2 className="text-[26px] font-semibold text-[#1A1A18] tracking-tight leading-snug">
          Connect your academic presence.
        </h2>
        <p className="text-[14px] text-[#7A786F] mt-1.5">
          None of these are required. Add what represents you.
        </p>
      </div>

      <div className="space-y-3">
        {LINK_PLATFORMS.map(({ key, icon }) => {
          const val = profile.links[key] || ''
          const connected = val.length > 0
          return (
            <div
              key={key}
              className="flex items-center gap-4 p-4 bg-white border border-[#DEDAD2] rounded-[4px]"
            >
              <span className="w-8 h-8 flex items-center justify-center text-[16px] text-[#7A786F] flex-shrink-0">
                {icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-[13px] font-semibold text-[#1A1A18]">{key}</span>
                  {connected && (
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#2E5E1E] bg-[#EAF1E6] px-1.5 py-0.5 rounded-[2px]">
                      Connected
                    </span>
                  )}
                </div>
                <input
                  type="url"
                  value={val}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    update({ links: { ...profile.links, [key]: e.target.value } })
                  }
                  placeholder={`Your ${key} URL or profile`}
                  className="w-full h-8 px-2.5 bg-[#F6F4EF] border border-[#DEDAD2] rounded-[3px] text-[13px] text-[#1A1A18] placeholder:text-[#C0BDB5] focus:border-[#2E5E1E] focus:ring-1 focus:ring-[#2E5E1E]/10 transition-all duration-150"
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 06 — Review ─────────────────────────────────────────────────────────

function Step06({ profile, strength }: { profile: ProfileData; strength: number }) {
  const connected = Object.entries(profile.links).filter(([, v]) => v)
  const suggestions = []
  if (!profile.photo) suggestions.push('Add a profile photo')
  if (profile.interests.length < 5) suggestions.push('Add more research interests')
  if (!profile.links['ORCID']) suggestions.push('Connect your ORCID')
  if (!profile.links['GitHub']) suggestions.push('Add your GitHub profile')

  return (
    <div className="step-enter space-y-8">
      <div>
        <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-1">
          Step 06 of 06 — Review
        </p>
        <h2 className="text-[26px] font-semibold text-[#1A1A18] tracking-tight leading-snug">
          Your academic identity.
        </h2>
        <p className="text-[14px] text-[#7A786F] mt-1.5">
          Review how your profile will appear across Cambium.
        </p>
      </div>

      {/* Summary card */}
      <div className="border border-[#DEDAD2] rounded-[4px] overflow-hidden">
        <div className="p-6 bg-white border-b border-[#DEDAD2] flex items-start gap-5">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-[#E8E5DF] flex-shrink-0">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="w-full h-full object-cover" />
            ) : (
              <img
                src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=128&h=128&fit=crop&auto=format"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            )}
          </div>
          <div>
            <h3 className="text-[20px] font-semibold text-[#1A1A18]">{profile.name}</h3>
            <p className="text-[14px] text-[#4A4845] mt-0.5">{profile.headline}</p>
            {profile.institution && (
              <p className="text-[13px] text-[#7A786F] mt-0.5">{profile.institution}</p>
            )}
            {(profile.city || profile.country) && (
              <p className="text-[12px] text-[#A8A59C] mt-0.5">
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>
        </div>

        <div className="divide-y divide-[#DEDAD2]">
          {profile.bio && (
            <div className="p-5 bg-white">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-2">
                About
              </p>
              <p className="text-[14px] text-[#2E2E2B] leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {profile.interests.length > 0 && (
            <div className="p-5 bg-white">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-3">
                Research Interests
              </p>
              <div className="flex flex-wrap gap-1.5">
                {profile.interests.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 bg-[#EAF1E6] border border-[#C6DDB9] text-[#2E5E1E] text-[12px] font-medium rounded-[3px]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {Object.keys(profile.skills).length > 0 && (
            <div className="p-5 bg-white">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-3">
                Expertise
              </p>
              <div className="flex flex-wrap gap-1.5">
                {Object.entries(profile.skills).map(([skill, level]) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 bg-[#F6F4EF] border border-[#DEDAD2] text-[#4A4845] text-[12px] rounded-[3px]"
                  >
                    {skill}
                    {level && (
                      <span className="text-[#A8A59C] ml-1">· {level}</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          )}

          {connected.length > 0 && (
            <div className="p-5 bg-white">
              <p className="text-[11px] font-semibold tracking-widest uppercase text-[#7A786F] mb-3">
                Academic Links
              </p>
              <div className="space-y-1.5">
                {connected.map(([platform, url]) => (
                  <div key={platform} className="flex items-center gap-2">
                    <span className="text-[12px] font-medium text-[#4A4845]">{platform}</span>
                    <span className="text-[12px] text-[#7A786F] truncate">{url}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile strength */}
      <div className="p-5 bg-[#F6F4EF] border border-[#DEDAD2] rounded-[4px]">
        <StrengthBar value={strength} />
        {suggestions.length > 0 && (
          <div className="mt-4 space-y-1.5">
            <p className="text-[12px] text-[#7A786F]">Suggestions to strengthen your profile:</p>
            {suggestions.map((s) => (
              <div key={s} className="flex items-center gap-2 text-[12px] text-[#4A4845]">
                <span className="w-1 h-1 rounded-full bg-[#A8A59C]" />
                {s}
              </div>
            ))}
          </div>
        )}
        <p className="text-[11px] text-[#A8A59C] mt-3">
          Optional fields never block completion.
        </p>
      </div>
    </div>
  )
}

// ─── Right Preview ────────────────────────────────────────────────────────────

function ProfilePreview({ profile, strength }: { profile: ProfileData; strength: number }) {
  const connectedLinks = Object.entries(profile.links).filter(([, v]) => v)

  return (
    <aside className="flex flex-col h-full bg-[#F2F0EB] border-l border-[#DEDAD2] overflow-y-auto">
      <div className="px-6 pt-7 pb-4 border-b border-[#DEDAD2]">
        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7A786F]">
          Live Preview
        </p>
        <p className="text-[11px] text-[#A8A59C] mt-0.5">How others will see you</p>
      </div>

      <div className="flex-1 px-6 py-6 space-y-5">
        {/* Profile header */}
        <div className="bg-white border border-[#DEDAD2] rounded-[4px] p-5">
          <div className="flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-[#E8E5DF] mb-3 ring-2 ring-[#DEDAD2]">
              {profile.photo ? (
                <img
                  src={profile.photo}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=128&h=128&fit=crop&auto=format"
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#2E5E1E] bg-[#EAF1E6] px-2 py-0.5 rounded-[2px] mb-2">
              Researcher
            </span>

            <h3 className="text-[18px] font-semibold text-[#1A1A18] leading-tight">
              {profile.name || 'Your Name'}
            </h3>
            {profile.headline && (
              <p className="text-[12px] text-[#4A4845] mt-1 leading-snug">{profile.headline}</p>
            )}
            {profile.institution && (
              <p className="text-[12px] text-[#7A786F] mt-0.5">{profile.institution}</p>
            )}
            {profile.department && (
              <p className="text-[11px] text-[#A8A59C] mt-0.5">{profile.department}</p>
            )}
            {(profile.city || profile.country) && (
              <p className="text-[11px] text-[#A8A59C] mt-0.5">
                {[profile.city, profile.country].filter(Boolean).join(', ')}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-4">
            <button className="flex-1 h-7 border border-[#DEDAD2] rounded-[3px] text-[11px] font-medium text-[#4A4845] hover:bg-[#F6F4EF] transition-colors">
              Follow
            </button>
            <button className="flex-1 h-7 border border-[#DEDAD2] rounded-[3px] text-[11px] font-medium text-[#4A4845] hover:bg-[#F6F4EF] transition-colors">
              Collaborate
            </button>
            <button className="flex-1 h-7 border border-[#DEDAD2] rounded-[3px] text-[11px] font-medium text-[#4A4845] hover:bg-[#F6F4EF] transition-colors">
              Message
            </button>
          </div>
        </div>

        {/* About */}
        {profile.bio && (
          <div className="bg-white border border-[#DEDAD2] rounded-[4px] p-4">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#7A786F] mb-2">
              About
            </p>
            <p className="text-[12px] text-[#2E2E2B] leading-relaxed">{profile.bio}</p>
          </div>
        )}

        {/* Research interests */}
        <div className="bg-white border border-[#DEDAD2] rounded-[4px] p-4">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#7A786F] mb-2">
            Research Interests
          </p>
          {profile.interests.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-[#EAF1E6] border border-[#C6DDB9] text-[#2E5E1E] text-[11px] font-medium rounded-[2px]"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-[12px] text-[#C0BDB5] italic">
              Research interests will appear here
            </p>
          )}
        </div>

        {/* Current research */}
        <div className="bg-white border border-[#DEDAD2] rounded-[4px] p-4">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-[#7A786F] mb-2">
            Current Research
          </p>
          {profile.researchDescription ? (
            <p className="text-[12px] text-[#2E2E2B] leading-relaxed">
              {profile.researchDescription}
            </p>
          ) : (
            <p className="text-[12px] text-[#C0BDB5] italic">Current research will appear here</p>
          )}
        </div>

        {/* Expertise */}
        {Object.keys(profile.skills).length > 0 && (
          <div className="bg-white border border-[#DEDAD2] rounded-[4px] p-4">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#7A786F] mb-2">
              Expertise
            </p>
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(profile.skills).map(([skill]) => (
                <span
                  key={skill}
                  className="px-2 py-0.5 bg-[#F6F4EF] border border-[#DEDAD2] text-[#4A4845] text-[11px] rounded-[2px]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Academic links */}
        {connectedLinks.length > 0 && (
          <div className="bg-white border border-[#DEDAD2] rounded-[4px] p-4">
            <p className="text-[10px] font-semibold tracking-widest uppercase text-[#7A786F] mb-2">
              Academic Links
            </p>
            <div className="space-y-1.5">
              {connectedLinks.map(([platform]) => (
                <div key={platform} className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2E5E1E]" />
                  <span className="text-[11px] font-medium text-[#2E5E1E]">{platform}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Strength */}
        <div className="bg-white border border-[#DEDAD2] rounded-[4px] p-4">
          <StrengthBar value={strength} />
          <p className="text-[11px] text-[#A8A59C] mt-2">
            Add research interests and academic links to strengthen your profile.
          </p>
        </div>
      </div>
    </aside>
  )
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [step, setStep] = useState(0)
  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [profile, setProfile] = useState<ProfileData>(INITIAL)
  const [saveStatus, setSaveStatus] = useState('Saved just now')
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const update = useCallback((patch: Partial<ProfileData>) => {
    setProfile((p) => ({ ...p, ...patch }))
    setSaveStatus('Saving…')
    if (saveTimer.current) clearTimeout(saveTimer.current)
    saveTimer.current = setTimeout(() => setSaveStatus('Saved just now'), 1200)
  }, [])

  useEffect(() => () => { if (saveTimer.current) clearTimeout(saveTimer.current) }, [])

  const strength = calcStrength(profile, step)

  const goNext = () => {
    setCompleted((prev) => new Set([...prev, step]))
    setStep((s) => Math.min(5, s + 1))
  }

  const goBack = () => setStep((s) => Math.max(0, s - 1))

  const isFinal = step === 5

  return (
    <div
      className="flex w-full bg-[#F6F4EF]"
      style={{ minHeight: '100vh', fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* Left rail — 18% */}
      <div className="w-[240px] flex-shrink-0 flex flex-col sticky top-0 h-screen">
        <LeftRail
          currentStep={step}
          completedSteps={completed}
          onStepClick={setStep}
          strength={strength}
          saveStatus={saveStatus}
        />
      </div>

      {/* Center builder — ~47% */}
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <div className="px-10 pt-10 pb-8 border-b border-[#DEDAD2] bg-[#F6F4EF]">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#7A786F] mb-1.5">
            Academic Identity
          </p>
          <h1 className="text-[34px] font-semibold text-[#1A1A18] tracking-tight leading-none">
            Create your academic identity
          </h1>
          <p className="text-[15px] text-[#7A786F] mt-2.5">
            Build the profile that represents your research, expertise, and academic journey.
          </p>
        </div>

        {/* Step content */}
        <div className="flex-1 px-10 py-8 overflow-y-auto">
          {step === 0 && <Step01 profile={profile} update={update} />}
          {step === 1 && <Step02 profile={profile} update={update} />}
          {step === 2 && <Step03 profile={profile} update={update} />}
          {step === 3 && <Step04 profile={profile} update={update} />}
          {step === 4 && <Step05 profile={profile} update={update} />}
          {step === 5 && <Step06 profile={profile} strength={strength} />}
        </div>

        {/* Bottom action bar */}
        <div className="px-10 py-5 border-t border-[#DEDAD2] bg-[#F6F4EF] flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="px-5 py-2.5 text-[13px] font-medium text-[#7A786F] hover:text-[#1A1A18] transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Back
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="px-4 py-2.5 text-[13px] font-medium text-[#4A4845] border border-[#DEDAD2] rounded-[3px] hover:bg-white transition-colors"
            >
              Save & continue later
            </button>

            {isFinal ? (
              <button
                type="button"
                className="px-6 py-2.5 bg-[#2E5E1E] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#3B7425] transition-colors"
              >
                Create my research identity
              </button>
            ) : (
              <button
                type="button"
                onClick={goNext}
                className="px-6 py-2.5 bg-[#1A1A18] text-white text-[13px] font-semibold rounded-[3px] hover:bg-[#2E2E2B] transition-colors"
              >
                Continue →
              </button>
            )}
          </div>
        </div>
      </main>

      {/* Right preview — 35% */}
      <div className="w-[340px] flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <ProfilePreview profile={profile} strength={strength} />
      </div>
    </div>
  )
}
