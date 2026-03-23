/** @format */
import { motion } from "framer-motion";

const CareerPath = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.4 }}>
			<div className='grid grid-cols-1 sm:grid-cols-2 sm:grid-rows-1 gap-x-2 h-[calc(100vh-11rem)] rounded-2xl'>
				<div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl pl-6 p-4 flex flex-col shadow-lg'>
					<h1 className='text-center text-2xl font-bold mb-4 underline'>
						Career Path
					</h1>
					<div className='flex-1 min-h-0 h-full overflow-y-auto pr-2 no-scrollbar'>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit.
							Inventore ea, eum, dignissimos esse modi iure assumenda earum ut
							explicabo porro aut cupiditate consectetur saepe, possimus quos
							placeat ipsum dolores accusamus voluptatem magni vero. Repellat,
							mollitia dignissimos. Repudiandae corrupti numquam nemo sapiente
							ab, veritatis alias blanditiis quae animi! Esse totam ratione quas
							illo dolores eum. Dolor accusantium eligendi alias assumenda
							voluptate sint porro consequatur ipsum reiciendis maxime?
							Assumenda, quod alias! Corporis fuga inventore ratione, quasi enim
							non tempora autem molestiae modi reiciendis necessitatibus aperiam
							repellendus mollitia dolores maxime magnam eius, animi voluptatem
							aspernatur voluptatibus vel. Voluptas ea rem suscipit maxime
							inventore? Aliquid inventore deleniti accusantium libero! Libero
							esse voluptates sed laudantium sequi repellat harum fuga omnis
							beatae totam! Quos ad ipsum officiis excepturi, consectetur omnis!
							Aliquid, ab architecto. Repudiandae saepe asperiores magnam beatae
							deleniti. Quis, suscipit dicta. Aliquid voluptates quos iste
							pariatur quibusdam! Esse quas dolorem est quod! Excepturi
							repudiandae hic ratione. Molestias accusamus totam beatae iusto
							unde, ipsum ex laborum suscipit? Modi delectus, sit distinctio
							saepe illo quaerat architecto. Sint, voluptatum ad? Animi et
							sapiente vel? Unde hic consequuntur dicta, modi possimus ipsum
							repellendus velit earum architecto eveniet sint saepe, et
							dignissimos consectetur ut iste quas, a alias quis quisquam
							ratione nemo. Debitis laboriosam inventore aut doloremque fuga
							eligendi corporis molestias eos quod vitae, voluptates, suscipit
							voluptate pariatur illo a cumque ratione, reprehenderit quibusdam!
							Obcaecati soluta sit, eaque in voluptates et, blanditiis id minima
							quo delectus iste! Temporibus, inventore maxime? Quae ullam quis
							eaque iure eius ad illum officia dicta.
						</p>
					</div>
				</div>
				<div className='bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl pl-6 p-4 flex flex-col shadow-lg'>
					<h1 className='text-center text-2xl font-bold mb-4 underline'>
						Job Suggestion
					</h1>
					<div className='flex-1 min-h-0 h-full overflow-y-auto pr-2 no-scrollbar'>
						<p>
							Lorem ipsum dolor sit amet, consectetur adipisicing elit.
							Inventore ea, eum, dignissimos esse modi iure assumenda earum ut
							explicabo porro aut cupiditate consectetur saepe, possimus quos
							placeat ipsum dolores accusamus voluptatem magni vero. Repellat,
							mollitia dignissimos. Repudiandae corrupti numquam nemo sapiente
							ab, veritatis alias blanditiis quae animi! Esse totam ratione quas
							illo dolores eum. Dolor accusantium eligendi alias assumenda
							voluptate sint porro consequatur ipsum reiciendis maxime?
							Assumenda, quod alias! Corporis fuga inventore ratione, quasi enim
							non tempora autem molestiae modi reiciendis necessitatibus aperiam
							repellendus mollitia dolores maxime magnam eius, animi voluptatem
							aspernatur voluptatibus vel. Voluptas ea rem suscipit maxime
							inventore? Aliquid inventore deleniti accusantium libero! Libero
							esse voluptates sed laudantium sequi repellat harum fuga omnis
							beatae totam! Quos ad ipsum officiis excepturi, consectetur omnis!
							Aliquid, ab architecto. Repudiandae saepe asperiores magnam beatae
							deleniti. Quis, suscipit dicta. Aliquid voluptates quos iste
							pariatur quibusdam! Esse quas dolorem est quod! Excepturi
							repudiandae hic ratione. Molestias accusamus totam beatae iusto
							unde, ipsum ex laborum suscipit? Modi delectus, sit distinctio
							saepe illo quaerat architecto. Sint, voluptatum ad? Animi et
							sapiente vel? Unde hic consequuntur dicta, modi possimus ipsum
							repellendus velit earum architecto eveniet sint saepe, et
							dignissimos consectetur ut iste quas, a alias quis quisquam
							ratione nemo. Debitis laboriosam inventore aut doloremque fuga
							eligendi corporis molestias eos quod vitae, voluptates, suscipit
							voluptate pariatur illo a cumque ratione, reprehenderit quibusdam!
							Obcaecati soluta sit, eaque in voluptates et, blanditiis id minima
							quo delectus iste! Temporibus, inventore maxime? Quae ullam quis
							eaque iure eius ad illum officia dicta.
						</p>
					</div>
				</div>
			</div>
		</motion.div>
	);
};

export default CareerPath;
