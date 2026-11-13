import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, StatusBar } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function App() {
  const [pantalla, setPantalla] = useState('inicio'); // 'inicio', 'juego', 'gameover'
  const [dificultad, setDificultad] = useState('normal'); // 'facil', 'normal', 'dificil'
  const [carril, setCarril] = useState(1); // 0: Izq, 1: Centro, 2: Der
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  
  // Obstáculo y Moneda
  const [obstaculo, setObstaculo] = useState({ carril: 1, posY: -150 });
  const [moneda, setMoneda] = useState({ carril: 0, posY: -300 });

  const iniciarJuego = (niv) => {
    setDificultad(niv);
    setScore(0);
    setCarril(1);
    setObstaculo({ carril: Math.floor(Math.random() * 3), posY: -150 });
    setMoneda({ carril: Math.floor(Math.random() * 3), posY: -300 });
    setPantalla('juego');
  };

  // Bucle principal infinito
  useEffect(() => {
    if (pantalla !== 'juego') return;

    const velocidad = dificultad === 'facil' ? 25 : dificultad === 'normal' ? 45 : 70;

    const intervalo = setInterval(() => {
      // Movimiento de obstáculos (Colisión = Fin del juego inmediato)
      setObstaculo((obs) => {
        const nuevaPosY = obs.posY + velocidad;
        
        // Zona de impacto exacta con el jugador
        if (nuevaPosY > height - 220 && nuevaPosY < height - 130) {
          if (obs.carril === carril) {
            setPantalla('gameover');
          }
        }

        if (nuevaPosY > height) {
          return { carril: Math.floor(Math.random() * 3), posY: -100 };
        }
        return { ...obs, posY: nuevaPosY };
      });

      // Movimiento de monedas (Recolectables)
      setMoneda((mon) => {
        const nuevaPosY = mon.posY + velocidad;

        // Recolectar moneda si el jugador está en el mismo carril
        if (nuevaPosY > height - 220 && nuevaPosY < height - 130) {
          if (mon.carril === carril) {
            setScore((s) => {
              const nuevoScore = s + 50; // Suman 50 puntos
              if (nuevoScore > highScore) setHighScore(nuevoScore);
              return nuevoScore;
            });
            return { carril: Math.floor(Math.random() * 3), posY: -400 };
          }
        }

        if (nuevaPosY > height) {
          return { carril: Math.floor(Math.random() * 3), posY: -350 };
        }
        return { ...mon, posY: nuevaPosY };
      });

    }, 100);

    return () => clearInterval(intervalo);
  }, [pantalla, carril, dificultad]);

  const mover = (dir) => {
    setCarril((prev) => {
      const n = prev + dir;
      return n >= 0 && n <= 2 ? n : prev;
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      {/* 1. PANTALLA DE INICIO */}
      {pantalla === 'inicio' && (
        <View style={styles.menuContainer}>
          <Text style={styles.titulo}>SPRINGFIELD RUN</Text>
          <Text style={styles.subtitulo}>Ing. Electrónica - UDEC</Text>
          
          <View style={styles.instruccionesBox}>
            <Text style={styles.instTitle}>📋 Instrucciones:</Text>
            <Text style={styles.instText}>• Modo Infinito: Sin tiempo y sin vidas.</Text>
            <Text style={styles.instText}>• Esquiva los obstáculos o morirás al instante.</Text>
            <Text style={styles.instText}>• ¡Atrapa las monedas doradas 🪙 para sumar más puntos!</Text>
          </View>

          <Text style={styles.selectDiffTitle}>Selecciona Dificultad:</Text>
          <View style={styles.diffContainer}>
            <TouchableOpacity style={[styles.diffBtn, {backgroundColor: '#22c55e'}]} onPress={() => iniciarJuego('facil')}>
              <Text style={styles.diffText}>FÁCIL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.diffBtn, {backgroundColor: '#eab308'}]} onPress={() => iniciarJuego('normal')}>
              <Text style={styles.diffText}>NORMAL</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.diffBtn, {backgroundColor: '#ef4444'}]} onPress={() => iniciarJuego('dificil')}>
              <Text style={styles.diffText}>DIFÍCIL</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 2. PANTALLA DE JUEGO INFINITO CON MONEDAS */}
      {pantalla === 'juego' && (
        <View style={styles.gameArea}>
          <View style={styles.sky} />
          
          <View style={styles.road}>
            <View style={styles.laneLine} />
            <View style={styles.laneLine} />
          </View>

          {/* HUD Superior (Récord y Score) */}
          <View style={styles.hud}>
            <View style={styles.box}>
              <Text style={styles.lbl}>RECORD</Text>
              <Text style={styles.val}>{highScore}</Text>
            </View>
            <View style={styles.box}>
              <Text style={styles.lbl}>SCORE 🪙</Text>
              <Text style={styles.val}>{score}</Text>
            </View>
          </View>

          {/* Moneda Dorada 🪙 */}
          <View style={[styles.moneda, { 
            left: moneda.carril === 0 ? width * 0.22 : moneda.carril === 1 ? width * 0.47 : width * 0.72,
            top: moneda.posY 
          }]}>
            <Text style={styles.monedaText}>🪙</Text>
          </View>

          {/* Obstáculo centrado en el carril */}
          <View style={[styles.obstaculo, { 
            left: obstaculo.carril === 0 ? width * 0.22 : obstaculo.carril === 1 ? width * 0.47 : width * 0.72,
            top: obstaculo.posY 
          }]} />

          {/* Personaje centrado en el carril */}
          <View style={[styles.player, { 
            left: carril === 0 ? width * 0.22 : carril === 1 ? width * 0.47 : width * 0.72 
          }]} />

          {/* Controles Táctiles */}
          <View style={styles.btns}>
            <TouchableOpacity style={styles.btnControl} onPress={() => mover(-1)}>
              <Text style={styles.btnText}>◀ IZQ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnControl} onPress={() => mover(1)}>
              <Text style={styles.btnText}>DER ▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 3. PANTALLA DE GAMEOVER */}
      {pantalla === 'gameover' && (
        <View style={styles.gameOverContainer}>
          <Text style={styles.goTitle}>¡CHOCASTE! 💥</Text>
          <Text style={styles.goScore}>Puntaje Final: {score}</Text>
          <Text style={styles.goRecord}>🏆 Mejor Puntaje Local: {highScore}</Text>

          <TouchableOpacity style={styles.restartBtn} onPress={() => setPantalla('inicio')}>
            <Text style={styles.restartText}>🔄 VOLVER AL MENÚ</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  menuContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#1e293b' },
  titulo: { fontSize: 30, fontWeight: '900', color: '#facc15', marginBottom: 5, textAlign: 'center' },
  subtitulo: { fontSize: 14, color: '#94a3b8', marginBottom: 25, fontWeight: 'bold' },
  instruccionesBox: { backgroundColor: '#334155', padding: 15, borderRadius: 12, marginBottom: 25, width: '100%', borderWidth: 1, borderColor: '#475569' },
  instTitle: { color: '#f8fafc', fontWeight: 'bold', fontSize: 16, marginBottom: 8 },
  instText: { color: '#cbd5e1', fontSize: 13, marginBottom: 4 },
  selectDiffTitle: { color: '#f1f5f9', fontWeight: 'bold', marginBottom: 12, fontSize: 15 },
  diffContainer: { flexDirection: 'row', gap: 10, width: '100%' },
  diffBtn: { flex: 1, padding: 14, borderRadius: 10, alignItems: 'center' },
  diffText: { color: '#fff', fontWeight: '900', fontSize: 14 },
  
  gameArea: { flex: 1, backgroundColor: '#38bdf8' },
  sky: { height: '25%', backgroundColor: '#38bdf8' },
  road: { flex: 1, backgroundColor: '#475569', marginHorizontal: 25, borderTopWidth: 6, borderColor: '#eab308', flexDirection: 'row', justifyContent: 'space-around' },
  laneLine: { width: 4, backgroundColor: 'rgba(255,255,255,0.4)', height: '100%' },
  
  hud: { position: 'absolute', top: 40, left: 15, right: 15, flexDirection: 'row', justifyContent: 'space-between' },
  box: { backgroundColor: 'rgba(15, 23, 42, 0.9)', borderWidth: 2, borderColor: '#facc15', paddingVertical: 6, paddingHorizontal: 16, borderRadius: 10, alignItems: 'center' },
  lbl: { fontSize: 10, color: '#fef08a', fontWeight: '900' },
  val: { fontSize: 16, color: '#fff', fontWeight: '900' },

  player: { position: 'absolute', bottom: 110, width: 42, height: 50, backgroundColor: '#fde047', borderRadius: 8, borderWidth: 2, borderColor: '#ca8a04', transform: [{ translateX: -21 }] },
  obstaculo: { position: 'absolute', width: 42, height: 42, backgroundColor: '#f97316', borderRadius: 6, borderWidth: 2, borderColor: '#c2410c', transform: [{ translateX: -21 }] },
  moneda: { position: 'absolute', width: 35, height: 35, justifyContent: 'center', alignItems: 'center', transform: [{ translateX: -17 }] },
  monedaText: { fontSize: 26 },

  btns: { position: 'absolute', bottom: 25, left: 20, right: 20, flexDirection: 'row', gap: 15 },
  btnControl: { flex: 1, backgroundColor: '#2563eb', padding: 16, borderRadius: 14, alignItems: 'center', borderWidth: 2, borderColor: '#93c5fd' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '900' },

  gameOverContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.9)', padding: 20 },
  goTitle: { fontSize: 26, color: '#f87171', fontWeight: '900', marginBottom: 15, textAlign: 'center' },
  goScore: { fontSize: 18, color: '#fff', marginBottom: 8, fontWeight: 'bold' },
  goRecord: { fontSize: 16, color: '#facc15', marginBottom: 25, fontWeight: 'bold' },
  restartBtn: { backgroundColor: '#2563eb', paddingVertical: 14, paddingHorizontal: 28, borderRadius: 14, borderWidth: 2, borderColor: '#93c5fd' },
  restartText: { color: '#fff', fontSize: 16, fontWeight: '900' }
});