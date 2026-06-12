import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import ActionPlan from '../components/actionPlan';
import Log from '../components/log';
import Sidebar from '../components/Sidebar';

export default function ProjectDetail() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [selectedMenuItem, setSelectedMenuItem] = useState('overall');

    const handleMenuItemClick = (menuItem) => {
        setSelectedMenuItem(menuItem);
    };

    let content;
    if (selectedMenuItem === 'overall') {
        content = <>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Obstruction(s)</div>
                <div className='project-objective-detail'><p>1. TVS NOW Platform</p><p>1.1 TVS Capability : Delay from&nbsp;Development partners</p><p>1.2 TVS NOW Package</p><p>1.3 TVS NOW on Smart TV</p><p><strong>Priority and&nbsp;Timeline with TrueID</strong></p><p>1. tvs now dedicate page เหมือน mobile &rarr; TBC agreement with True ID team (K.George)</p><p>2. epg improvement : show thumbnail &rarr; Already sent all requirement</p><p>3. Continue watching from last abnormal exit : Pop up &quot;continue from other device?&rdquo; &rarr; TBC agreement with True ID team (K.George)</p><p>4. limit concurrent (waiting management)</p><p>1.4 Content Acquisition</p><p>1.5 True point CRM</p><p>1.6 Address Piracy issue</p><p>1.7 Supper Apps</p><p>1.8 Strategic Advertising</p><p>1.9 TNN News (Clip VDO)</p><p>1.10 TVS Senior package</p><p>1.11 Pricing &amp; Packaging</p><p>1.12 Food channel for SME : Feasibility study</p></div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Solution(s)</div>
                <div className='project-objective-detail'><p>1. TVS NOW Platform</p><p>1.1 TVS Capability</p><p>Transfer project development&nbsp;to TrueID Dev team and TVS sponsor&nbsp;</p><p>&nbsp;</p><p>1.2 TVS NOW Package</p><p>1.3 TVS NOW on Smart TV</p><p>1.Meeting and sent&nbsp;feature detail to&nbsp;TrueID team on Mar 2022</p><p>2.&nbsp; Align priority and timeline with TrueID</p><p>&nbsp;</p><p>1.4 Content Acquisition</p><p>1.5 True point CRM</p><p>1.6 Address Piracy issue</p><p>1.7 Supper Apps : เนื่องจากทรูวิชั่นส์นาวไม่มีแอปพลิเคชั่นเป็น standalone&nbsp;และใช้ TrueID application จึงนำส่วนนี้ไปอยู่กับ TrueID application&nbsp; และ Follow TrueID strategy</p><p>&nbsp;</p><p>1.8 Strategic Advertising</p><p>1.9 TNN News (Clip VDO)</p><p>1.10 TVS Senior package</p><p>1.11 Pricing &amp; Packaging</p><p>1.12 Food channel for SME : cancel</p></div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Project Period </div>
                <div className='project-objective-detail'>Possibility : High</div>
                <div className='project-objective-detail'>Impact : High</div>

            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Team Member</div>
                <div className='project-objective-detail'>1. Ongard Prapakamol (Project Owner - Responsibility)</div>
            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Project Prioritization</div>
                <div className='project-objective-detail'>03/01/2022 - 30/04/2022</div>

            </div>
            <div className='detail-box' style={{ marginBottom: '20px' }}>
                <div className='project-objective'>Project Investment</div>
                <div className='project-objective-detail'>Investment : 22000000 </div>
                <div className='project-objective-detail'>Investment Detail: TBD</div>
            </div></>;
    } else if (selectedMenuItem === 'actionPlan') {
        content = <ActionPlan />;
    } else if (selectedMenuItem === 'roi') {
        content =
            <div className='roi-flex'>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        KPI Type
                    </div>
                    <div className='project-roi-detail'>
                        Quantitative
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        ROI Type
                    </div>
                    <div className='project-roi-detail'>
                        Cost saving
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Year
                    </div>
                    <div className='project-roi-detail'>
                        2023
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Target
                    </div>
                    <div className='project-roi-detail'>
                        1,500,000,000 Baht
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-roi-title'>
                        Description
                    </div>
                    <div className='project-roi-detail'>
                        ROI มาจากการขายแพ็คเกจ TrueVision Now ทั้งแพ็คเกจหลักและเสริมบน TrueID platform
                    </div>
                </div>
            </div>
    } else if (selectedMenuItem === 'attachment') {
        content =
            <div className='roi-flex'>
                <div className='roi-menu-flex'>
                    <div className='project-attachment-title'>
                        File 1
                    </div>
                    <div className='project-roi-detail'>
                        <form action="/action_page.php">
                            <input type="file" id="myFile" name="filename" />
                        </form>
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-attachment-title'>
                        File 2
                    </div>
                    <div className='project-roi-detail'>
                        <form action="/action_page.php">
                            <input type="file" id="myFile" name="filename" />
                        </form>
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-attachment-title'>
                        File 3
                    </div>
                    <div className='project-roi-detail'>
                        <form action="/action_page.php">
                            <input type="file" id="myFile" name="filename" />
                        </form>
                    </div>
                </div>
                <div className='roi-menu-flex'>
                    <div className='project-attachment-title'>
                        File 4
                    </div>
                    <div className='project-roi-detail'>
                        <form action="/action_page.php">
                            <input type="file" id="myFile" name="filename" />
                        </form>
                    </div>
                </div>
                <div className='insert-note-flex'>
                    <div className='insert-note'>
                        <img className='insert-img' src={process.env.PUBLIC_URL + "/assets/plus.png"} />
                        <div>
                            Upload File
                        </div>
                    </div>
                </div>
            </div>
    } else if (selectedMenuItem === 'note') {
        content =
            <div>
                <TextField
                    style={{ textAlign: 'left', width: '100%', marginBottom: '15px' }}
                    hintText="Message Field"
                    floatingLabelText="MultiLine and FloatingLabel"
                    multiline
                    rows={15}
                />
                <div className='insert-note-flex'>
                    <div className='insert-note'>
                        <img className='insert-img' src={process.env.PUBLIC_URL + "/assets/plus.png"} />
                        <div>
                            Insert Note
                        </div>
                    </div>
                </div>
            </div>
    } else if (selectedMenuItem === 'log') {
        content = <Log />
    }

    return (
        <div className="App">
            <Sidebar onToggle={setSidebarOpen} />
            <div className={sidebarOpen ? 'body-grid' : 'body-grid-close'}>
                <div className='header_container'>
                    <img className='true-logo' src={process.env.PUBLIC_URL + "/assets/true-logo.png"} alt="True Logo" />
                </div>
                <div className="body_container">
                    <div className='project-detail-title-flex'>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img className='ball-detial-processing' />
                            <div className='project-detail-title'>Project : TVS NOW Platform</div>
                        </div>
                        <div className='download-model-box'>
                            <img className='subtract-icon' src={process.env.PUBLIC_URL + "/assets/subtract.png"} />
                            <div className='download-model'>Download Business Model</div>
                        </div>
                    </div>
                    <div className='project-owner-grid'>
                        <div className='project-owner-box'>
                            <div className='project-owner-box-flex'>
                                <div className='project-owner-title'>
                                    PROJECT OWNER
                                </div>
                                <img className='project-owner-img' src={process.env.PUBLIC_URL + "/assets/user.png"} />
                                <div className='project-owner-name'>
                                    Ongard Prapakamol
                                </div>
                                <div className='project-owner-detail-box'>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Description</div>
                                        <div className='project-description-detail'>การจ้าง Vendor CP Match พัฒนา platform ให้ TVS NOW สำหรับชมผ่านแอปทรูไอดี และ จ่าย TDG team ในการจ้าง Dev และ QA มาพัฒนาต่อจาก CPM</div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Objective</div>
                                        <div className='project-objective-detail'><p>1. สร้าง TVS Now Platform เพื่อเพิ่มช่องทางในการเข้าถึง Content ของ TVS ทั้ง &nbsp;Live TV &nbsp;และ VOD ภายใต้ TrueID platform</p><p>2.นำคอนเท้นท์ไปอยู่ในทุก Platform Smart TV</p><p>3.มี contents ที่ครบครันหลากหลาย&nbsp;</p><p>4.ทำแพ็กเกจที่ตอบโจทย์ลูกค้า 3 major pack + 3 top up</p><p>5.Truepoint จูงใจลูกค้าให้ซื้อสินค้า CPG&nbsp;</p><p>6.ลดการละเมิดลิขสิทธิ์ เพิ่มฐานของลูกค้า&nbsp;</p><p>7.Application ที่สามารถเข้าต่อไปยัง App ต่างๆ ได้&nbsp;</p><p>8.&nbsp;การทำ Content Advertising ให้น่าสนใจน่าติดตาม</p><p>9.พัฒนา VDO Clip เพื่อรองรับ Platform ใหม่ๆ&nbsp;</p><p>10.&nbsp;ออกแบบสำรวจความต้องการของลูกค้ากลุ่ม Gen X&nbsp;</p><p>11.การตั้งราคาแต่ละแพคเกจ</p><p>12.สรรหา เจรจา Food Inﬂuencer / Youtuber และ ร้านอาหารเก่าแก่เจ้าดังในอดีต</p></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-description'>Project Progress / What you have done ?(s)</div>
                                        <div className='project-objective-detail'><p>1. TVS NOW Platform</p><p>1.1 TVS Capability 40%</p><ul><li>Phase I : launch on 28 May 2022</li><li>พัฒนาโดย CP Match : ส่งมอบแล้ว โดย source code เรียบร้อยแล้วปลายเดือนมิ.ย. อยู่กับ TID แต่ยังไม่ได้นำขึ้นใช้จริง</li><li>CPM Delay and transfer to TrueID เพื่อดำเนินจัดหาทีมดูแลต่อไปโดย TrueVisions sponsor คนไปนั่งที่ TID ในส่วนของ Dev และ QA<br /><br /><strong>Cost</strong></li><li>QT CPM 20.18 MB (TBC cost ,Procurement process)</li><li>TID dev &amp; QA Team 15&nbsp;headcounts<ul><li>period Jul-Dec 2022</li><li>platform : mobile app , Website</li><li>Developer : mobile app 8 , web 2</li><li>QA &nbsp;5 (mobile app, web , OTT)&nbsp;</li><li>Cost 7.4 MB</li></ul></li></ul><p>&nbsp;</p><p>1.2 TVS NOW Package 100%</p><p>launch :&nbsp;</p><p>main package : Now premium , Now standard , Now lite</p><p>topping : F1 &amp; SPO TV , NFL &amp; NBA , Golf , F1 season pass</p><p>&nbsp;</p><p>add on: ยังอยู่ในการพิจารณาการทำ Family Sharing จาก TrueID, CCU and mirror package</p><p>&nbsp;</p><p>1.3 TVS NOW on Smart TV : 25%</p><p>TrueID จะรับไปทำให้เองแทน iWedia, requirements submitted</p><p><strong>TrueID OTT Plan</strong></p><p><strong>&nbsp;V. 22.09 (Jun) : Launch</strong></p><p>&nbsp;- ลูกค้าสมัคร package TVS now ได้&nbsp;</p><p>&nbsp;- มีหน้าจอสมัคร package TVS now ที่ดึงดูดให้ลูกค้าสมัคร โดยเฉพาะ&nbsp;</p><p>&nbsp;- แสดง logo TVS now บน Top bar ถ้าเป็นลูกค้า TVS now</p><p><strong>V. 22.xx (Aug)</strong></p><ul><li>Most watch (TVS) phase 1 (Most watch, LiveTV shelf, Catchup shelf, Sport shelf)</li><li>Open Most watch (TVS) with left button on LiveTV</li></ul><p><strong>V 22.xx (Oct)</strong></p><ul><li>Nested shelf in Most view</li></ul><p>&nbsp;</p><p>1.4 Content Acquisition : 88%</p><p>TVS NOW - On Demand: CMS data input for 650 titles&nbsp;from target of 800 tiltles</p><p>Channels - logo update (TVS NOW)</p><p>การรวมคอนเท้นท์จาก TrueID+ เข้ามา อยู่ระหว่างพิจารณา</p><p>&nbsp;</p><p>1.5 True point CRM 50% : อยู่ระหว่างการศึกษา Cost and Revenu</p><p>&nbsp;</p><p>1.6 Address Piracy issue 60% : On going ปิดไป 6 เคสรายใหญ่ Fwiptv, oktv.th, กลุ่ม siamdata (การพนัน), movieclubhd, กลุ่ม weplayhd, Liont</p><p>&nbsp;</p><p>1.7 Supper Apps 100%</p><p>กำลังอยู่ระหว่างการศึกษา ขึ้นอยู่กับ platform ว่าจะสามารถเชื่อมต่อกับแอปต่างๆได้หรือไม่</p><p>Update Jun 2022<br />1. Next step : transfer this project to TrueID team</p><p>&nbsp;</p><p>1.8 Strategic Advertising 50% : On going</p><p>&nbsp;</p><p>1.9 TNN News (Clip VDO) &nbsp;80%</p><p>On progress (Video+Vertical)</p><p>&nbsp;Youtube - done</p><p>Tiktok (Short VDO)&nbsp; - done</p><p>LINE VOOM - done</p><p>FB Short VDO - TBC</p><p>IG Short VDO &ndash; TBC</p><p>&nbsp;</p><p>1.10 TVS Senior package 100% : Research result &ndash; Done</p><p>&nbsp;</p><p>1.11 Pricing &amp; Packaging 100%</p><p>Platinum 2155/1800 /Gold 1568/1300 /Super 899/700 /Sport 590/300 /Smart 490/200 /Happy 299/100</p><p>&nbsp;</p><p>1.12 Food channel for SME 100%</p><p><strong>Jan&nbsp;</strong>: อยู่ระหว่างการศึกษา&nbsp;Cost and Revenue<br /><br /><strong>update on Jun :&nbsp; Cancel project </strong><strong>เนื่องจาก ไม่คุ้มค่ากับการลงทุน</strong></p></div>
                                    </div>
                                    <div className='detail-box' style={{ marginBottom: '20px' }}>
                                        <div className='project-objective'>Project Progress</div>
                                        <div className='project-description-detail'>Level : SF - Strategy Formulation</div>
                                        <div className='project-description-detail'>% Progress : 74.4 %</div>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <div className='project-create-time'>Create Date : 19 Dec 2022 15:30:38 | Create By : Ongard Prapakamol</div>
                                <div className='project-update-time'>Last Update : 14 May 2023 15:52:56 | Update By : Ongard Prapakamol</div>
                            </div>
                        </div>
                        <div className='project-description-box'>
                            <div className='project-description-menu'>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('overall')}>Overall</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('actionPlan')}>Action Plan</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('roi')}>ROI</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('attachment')}>Attachment</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('note')}>Note</div>
                                <div className='project-description-menuitem' onClick={() => handleMenuItemClick('log')}>Log</div>
                            </div>
                            <div className='project-description-detail-box'>
                                {content}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
