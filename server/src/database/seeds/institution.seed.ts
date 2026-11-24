import { DataSource } from 'typeorm';
import { Organization } from '../../modules/institution/entities/organization.entity';
import { Department } from '../../modules/institution/entities/department.entity';
import { Proposal } from '../../modules/institution/entities/proposal.entity';
import { FundingAccount } from '../../modules/institution/entities/funding-account.entity';
import { BudgetLineItem } from '../../modules/institution/entities/budget-line-item.entity';
import { ComplianceProtocol } from '../../modules/institution/entities/compliance-protocol.entity';

/**
 * Idempotent Proof-of-Value institutional seed for AMET University R&D Ecosystem.
 */
export async function seedInstitutionalProofOfValue(dataSource: DataSource, leadUserId: string) {
  const orgRepo = dataSource.getRepository(Organization);
  const deptRepo = dataSource.getRepository(Department);
  const propRepo = dataSource.getRepository(Proposal);
  const fundRepo = dataSource.getRepository(FundingAccount);
  const lineRepo = dataSource.getRepository(BudgetLineItem);
  const compRepo = dataSource.getRepository(ComplianceProtocol);

  let org = await orgRepo.findOne({ where: { shortCode: 'AMET' } });
  if (!org) {
    org = await orgRepo.save(
      orgRepo.create({
        name: 'AMET University Central R&D and Innovation Centre',
        shortCode: 'AMET',
        rorId: '01amet001',
        city: 'Chennai',
        country: 'India',
      }),
    );
  }

  let deptA = await deptRepo.findOne({ where: { organizationId: org.id, code: 'AIMC' } });
  if (!deptA) {
    deptA = await deptRepo.save(
      deptRepo.create({
        organizationId: org.id,
        name: 'Centre for AI & Marine Computing',
        code: 'AIMC',
        annualBudgetCap: '2500000',
        currency: 'INR',
      }),
    );
  }

  let deptB = await deptRepo.findOne({ where: { organizationId: org.id, code: 'BIOENG' } });
  if (!deptB) {
    deptB = await deptRepo.save(
      deptRepo.create({
        organizationId: org.id,
        name: 'Coastal Biotechnology & Sensors Lab',
        code: 'BIOENG',
        annualBudgetCap: '1800000',
        currency: 'INR',
      }),
    );
  }

  const existingGrant = await fundRepo.findOne({ where: { grantNumber: 'AMET-RND-2026-WQM-01' } });
  if (!existingGrant) {
    const account = await fundRepo.save(
      fundRepo.create({
        organizationId: org.id,
        departmentId: deptA.id,
        piUserId: leadUserId,
        grantNumber: 'AMET-RND-2026-WQM-01',
        funderName: 'AMET University Internal Research Fund',
        title: 'Low-Cost AI Water Quality Monitoring & Coastal Telemetry Initiative',
        currency: 'INR',
        financialState: 'SANCTIONED',
        requestedAmount: '1000000',
        approvedAmount: '1000000',
        sanctionedAmount: '1000000',
        receivedAmount: '600000',
        committedAmount: '200000',
        spentAmount: '400000',
        fiscalYear: '2026-27',
      }),
    );

    const lines = [
      { category: 'Equipment', allocated: '300000', committed: '100000', spent: '150000' },
      { category: 'Research Materials', allocated: '200000', committed: '50000', spent: '100000' },
      { category: 'Software & Infrastructure', allocated: '100000', committed: '0', spent: '50000' },
      { category: 'Research Assistance', allocated: '200000', committed: '50000', spent: '100000' },
      { category: 'Travel & Publication', allocated: '100000', committed: '0', spent: '0' },
      { category: 'Contingency', allocated: '100000', committed: '0', spent: '0' },
    ];
    await lineRepo.save(
      lines.map((l) =>
        lineRepo.create({
          fundingAccountId: account.id,
          category: l.category,
          allocatedAmount: l.allocated,
          committedAmount: l.committed,
          spentAmount: l.spent,
        }),
      ),
    );
  }

  const existingProposals = await propRepo.count({ where: { organizationId: org.id } });
  if (existingProposals === 0) {
    await propRepo.save(
      propRepo.create({
        organizationId: org.id,
        departmentId: deptA.id,
        leadUserId,
        title: 'Affordable AI-Driven Coastal Water Quality Sensing Network',
        funder: 'DST SERB / AMET Seed Fund',
        program: 'Clean Water & Marine Robotics',
        requestedAmount: '1000000',
        currency: 'INR',
        status: 'APPROVED',
        aims: 'Design edge-AI dissolved oxygen and salinity sensors for estuary monitoring.',
        significance: 'Enables continuous community aquaculture safety monitoring across coastal districts.',
        methodology: 'LoRaWAN sensor array paired with calibrated quantized TinyML anomaly models.',
        keywords: ['Water Quality', 'Edge AI', 'Marine Sensors'],
      }),
    );
  }

  const existingProtocol = await compRepo.findOne({ where: { protocolNumber: 'AMET-IEC-2026-014' } });
  if (!existingProtocol) {
    await compRepo.save(
      compRepo.create({
        organizationId: org.id,
        departmentId: deptA.id,
        piUserId: leadUserId,
        protocolNumber: 'AMET-IEC-2026-014',
        committeeType: 'IRB',
        title: 'Coastal Estuary Field Sampling & Open Telemetry Governance Protocol',
        boardName: 'AMET Institutional Ethics & Biosafety Review Board',
        riskCategory: 'Exempt',
        status: 'APPROVED',
        participatingSitesCount: 3,
      }),
    );
  }

  return { organizationId: org.id, deptAId: deptA.id, deptBId: deptB.id };
}
