import React from 'react';
import { Link } from 'react-router-dom';
import image from '../assets/Gemini_Generated_Image_at6pi2at6pi2at6p.png';

export default function UserGuide() {
  return (
    <div className="bg-[#221610] text-[#f8ddd4] font-sans min-h-screen overflow-x-hidden selection:bg-primary selection:text-white">

      <div className="flex min-h-screen relative">
        {/* Main Content Canvas */}
        <main className="flex-1 lg: p-24 lg:px-32 relative overflow-hidden">
          {/* Background Watermark */}
          <div className="absolute right-220 top-20 text-[12rem] font-black pointer-events-none text-primary opacity-[0.03] rotate-12 select-none uppercase">HISTORY</div>
          <div className="absolute right-280 top-160 text-[12rem] font-black pointer-events-none text-primary opacity-[0.03] rotate-12 select-none uppercase">GUIDE</div>

          <div className="max-w-10xl mx-auto space-y-32">
            {/* Section 1: The Legend */}
            <section className="relative" id="history">
              <div className="text-primary font-bold uppercase tracking-widest text-xs mb-4">01 - THE ORIGIN</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h2 className="text-5xl font-black italic tracking-tighter text-[#f8ddd4] leading-none">THE LEGEND OF <span className="text-primary">HAND-CRICKET</span></h2>
                  <p className="text-xl text-[#e2bfb3] leading-relaxed">
                    Born in the classrooms and school corridors of South Asia, Hand-Cricket was the ultimate equalizer. No bat, no ball—just pure cognitive warfare. 
                  </p>
                  <p className="text-[#e2bfb3]/80">
                    Hand-Cricket Pro evolves this nostalgic rivalry into a high-octane digital arena. Using advanced Computer Vision, your physical gestures are translated into virtual strikes, bringing the playground to the global stage.
                  </p>
                </div>
                <div className="relative group ">
                  <div className="absolute inset-0 bg-primary/20 rounded-xl blur-2xl group-hover:bg-primary/30 transition-all"></div>
                  <img className="relative rounded-xl border border-[#5a4138]/20 grayscale hover:grayscale-0 transition-all duration-400 w-full h-[450px] object-cover shadow-2xl" data-alt="Abstract dynamic cricket player silhouette in orange light" src={image} alt=""/>
                </div>
              </div>
            </section>

            {/* Section 2: The Setup */}
            <section className="space-y-12" id="setup">
              <div className="text-primary font-bold uppercase tracking-widest text-xs">02 - THE SETUP</div>
              <h2 className="text-5xl font-black italic tracking-tighter text-[#f8ddd4]">CAMERA PREPARATION</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="bg-[#2b1c17] p-8 rounded-xl border-l-4 border-primary space-y-4 hover:bg-[#362621] transition-colors group relative overflow-hidden">
                  <span className="material-symbols-outlined text-primary text-4xl" data-icon="person_outline">person_outline</span>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">Positioning</h3>
                  <p className="text-sm text-[#e2bfb3]">Sit or stand far enough back so that your hand is fully visible within the camera frame.</p>
                </div>
                <div className="bg-[#2b1c17] p-8 rounded-xl border-l-4 border-primary space-y-4 hover:bg-[#362621] transition-colors group relative overflow-hidden">
                  <span className="material-symbols-outlined text-primary text-4xl" data-icon="lightbulb">lightbulb</span>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">Lighting</h3>
                  <p className="text-sm text-[#e2bfb3]">Ensure your room is well-lit. The camera needs high contrast between your hand and the background to accurately detect your fingers.</p>
                </div>
                <div className="bg-[#2b1c17] p-8 rounded-xl border-l-4 border-primary space-y-4 hover:bg-[#362621] transition-colors group relative overflow-hidden">
                  <span className="material-symbols-outlined text-primary text-4xl" data-icon="crop_free">crop_free</span>
                  <h3 className="text-2xl font-bold uppercase tracking-tight">The "Pitch"</h3>
                  <p className="text-sm text-[#e2bfb3]">Most webcam games will have a designated bounding box or an on-screen prompt showing where you need to hold your hand for the gestures to register.</p>
                </div>
              </div>
            </section>

            {/* Section 3: The Gestures */}
            <section className="space-y-12" id="gestures">
              <div className="text-primary font-bold uppercase tracking-widest text-xs">03 - THE GESTURES (RUNS)</div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                  <h2 className="text-5xl font-black italic tracking-tighter text-[#f8ddd4]">KINETIC INTERFACE</h2>
                  <p className="text-xl text-[#e2bfb3] mt-4 max-w-2xl">Instead of typing numbers, you will use standard hand signs to represent runs from 1 to 6. The gesture recognition software will track your extended fingers.</p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { num: 1, desc: "Index finger up." , img: "https://thumbs.dreamstime.com/b/human-cartoon-hand-showing-one-finger-pointing-upwards-87864652.jpg" },
                  { num: 2, desc: "Index & middle fingers up." , img: "https://as1.ftcdn.net/jpg/01/39/56/30/1000_F_139563011_48Am9KqfvjMe6ztlgEvoRYCpFkZTYSyT.jpg" },
                  { num: 3, desc: "Index, middle, & ring fingers up." , img: "https://tse1.mm.bing.net/th/id/OIP.NJ3jD4_C5tcxLWLss-qnyQAAAA?pid=ImgDet&w=159&h=105&c=7&o=7&rm=3" },
                  { num: 4, desc: "Four fingers up, thumb tucked." , img: "https://thumbs.dreamstime.com/b/human-cartoon-hand-showing-four-fingers-number-87864701.jpg?w=576" },
                  { num: 5, desc: "All five fingers extended." , img: "https://as1.ftcdn.net/v2/jpg/01/39/56/28/1000_F_139562890_UPGlB0G85tl14uukEpaoSvOvgYt4Da2Y.jpg" },
                  { num: 6, desc: "Thumb up, fist closed." , img: "https://www.creativefabrica.com/wp-content/uploads/2024/04/21/Hand-Gesture-Icon-Graphics-95906026-1.jpg" }
                ].map((item) => (
                  <div key={item.img} className="bg-[#261813] p-6 rounded-xl border border-[#5a4138]/20 flex flex-col items-center text-center hover:border-primary/50 transition-all group">
                    <img src={item.img} alt="" className="w-full h-30 object-cover rounded-lg mb-2" />
                    <div className="text-primary font-black text-2xl italic mb-2">{item.num} RUN{item.num > 1 ? 'S' : ''}</div>
                    <p className="text-xs text-[#e2bfb3]/80 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Section 4: Gameplay Loop */}
            <section className="space-y-12 pb-20" id="scoring">
              <div className="text-primary font-bold uppercase tracking-widest text-xs">04 - THE GAMEPLAY LOOP</div>
              <div className="bg-[#41312b]/30 rounded-2xl p-8 lg:p-12 border border-primary/10 relative overflow-hidden">
                <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h2 className="text-5xl font-black italic tracking-tighter text-[#f8ddd4] uppercase mt-0">CORE RULES</h2>
                    <p className="text-lg text-[#e2bfb3] mb-8">The core rules remain identical to the schoolyard version. Outsmart the computer through rapid gestures!</p>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-4 bg-[#261813] p-6 rounded-xl border border-[#5a4138]/30">
                        <div className="w-12 h-12 bg-[#ec5b13]/10 flex-shrink-0 flex items-center justify-center rounded-lg text-primary">
                          <span className="material-symbols-outlined" data-icon="casino">casino</span>
                        </div>
                        <div>
                          <div className="font-bold text-lg uppercase tracking-tight text-[#ffffff] mb-1">The Toss (Odd or Even)</div>
                          <div className="text-sm text-[#e2bfb3]">You will be prompted to show a number. The computer will randomly generate its own. If you chose "Even" and the sum is an even number, you win the toss and choose to bat or bowl.</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 bg-[#261813] p-6 rounded-xl border border-[#5a4138]/30">
                        <div className="w-12 h-12 bg-[#ec5b13]/10 flex-shrink-0 flex items-center justify-center rounded-lg text-primary">
                          <span className="material-symbols-outlined" data-icon="sports_cricket">sports_cricket</span>
                        </div>
                        <div>
                          <div className="font-bold text-lg uppercase tracking-tight text-[#ffffff] mb-1">Batting</div>
                          <div className="text-sm text-[#e2bfb3]">You and the computer flash a hand gesture simultaneously. If your number <strong>does not match</strong>, it's added to your score. If it <strong>matches</strong>, you are OUT.</div>
                        </div>
                      </li>
                      <li className="flex items-start gap-4 bg-[#261813] p-6 rounded-xl border border-[#5a4138]/30">
                        <div className="w-12 h-12 bg-[#ec5b13]/10 flex-shrink-0 flex items-center justify-center rounded-lg text-primary">
                          <span className="material-symbols-outlined" data-icon="sports_baseball">sports_baseball</span>
                        </div>
                        <div>
                          <div className="font-bold text-lg uppercase tracking-tight text-[#ffffff] mb-1">Bowling</div>
                          <div className="text-sm text-[#e2bfb3]">The roles reverse. You want to perfectly match the computer's gesture to get it out before it chases down your target score.</div>
                        </div>
                      </li>
                    </ul>
                  </div>
                  <div className="bg-[#2b1c17] p-8 rounded-xl border border-primary/20 flex flex-col space-y-8">
                    <div className="space-y-4">
                      <h3 className="text-2xl font-black italic text-primary uppercase">Tips for Accuracy</h3>
                      <div className="space-y-6 mt-6">
                        <div className="border-l-2 border-primary/50 pl-4">
                          <h4 className="font-bold text-white uppercase text-sm mb-1">Fingers Apart</h4>
                          <p className="text-sm text-[#e2bfb3]">Keep your extended fingers slightly separated. If they overlap, hand-tracking algorithms might count them as a single finger.</p>
                        </div>
                        <div className="border-l-2 border-primary/50 pl-4">
                          <h4 className="font-bold text-white uppercase text-sm mb-1">Light from the Front</h4>
                          <p className="text-sm text-[#e2bfb3]">Never have a bright lamp or window directly behind you. This creates a "silhouette effect" where your hand appears as a dark shadow, making it impossible for the camera to see individual finger joints. Place your light source behind the webcam, facing you.</p>
                        </div>
                        <div className="border-l-2 border-primary/50 pl-4">
                          <h4 className="font-bold text-white uppercase text-sm mb-1">Avoid Quick Jerks</h4>
                          <p className="text-sm text-[#e2bfb3]">Hold your gesture steady for at least a second when the countdown ends. Motion blur can cause the system to misread a "3" as a "2".</p>
                        </div>
                        <div className="border-l-2 border-primary/50 pl-4">
                          <h4 className="font-bold text-white uppercase text-sm mb-1">The "Face-On" Rule</h4>
                          <p className="text-sm text-[#e2bfb3]">Always show your palm or the back of your hand directly to the camera lens. Tilting your hand at an angle causes "occlusion," where one finger hides behind another, leading the AI to miscount your runs.</p>
                        </div>
                        <div className="border-l-2 border-primary/50 pl-4">
                          <h4 className="font-bold text-white uppercase text-sm mb-1">Neutral Backgrounds</h4>
                          <p className="text-sm text-[#e2bfb3]">Avoid backgrounds with a lot of movement or clutter (like a bookshelf or a window with people passing by). A plain wall is best because it prevents the AI from mistaking a background object for a finger.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="w-full py-12 px-8 mt-auto bg-[#221610] border-t border-[#5a4138]/10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 max-w-screen-2xl mx-auto">
          <div className="text-[#ec5b13] font-black opacity-20 text-xl tracking-tighter">HAND-CRICKET PRO</div>
          <div className="flex gap-8">
            <a className="text-xs uppercase tracking-widest text-white/30 hover:text-[#ec5b13] hover:tracking-[0.1em] transition-all" href="#">Privacy Policy</a>
            <a className="text-xs uppercase tracking-widest text-white/30 hover:text-[#ec5b13] hover:tracking-[0.1em] transition-all" href="#">Terms of Play</a>
            <a className="text-xs uppercase tracking-widest text-white/30 hover:text-[#ec5b13] hover:tracking-[0.1em] transition-all" href="#">Contact Support</a>
          </div>
          <div className="text-xs uppercase tracking-widest text-white/30">© 2024 HAND-CRICKET PRO. KINETIC PULSE ENGINE.</div>
        </div>
      </footer>
    </div>
  );
}
